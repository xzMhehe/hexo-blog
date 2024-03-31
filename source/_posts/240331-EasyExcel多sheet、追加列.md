---
title: 业务-EasyExcel多sheet、追加列
date: 2024-03-31 14:17:57
tags:
  - 业务
categories:
  - 业务
keywords:
  - 业务
description: 业务-EasyExcel多sheet、追加列
headimg: https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/gf/20240331142111.png
thumbnail: https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/gf/20240331142111.png
---

# 业务-EasyExcel多sheet、追加列

## 背景
最近接到一个导出Excel的业务，需求就是`多sheet`，`每个sheet导出不同结构`，`第一个sheet里面能够根据最后一列动态的追加列`。原本使用的 pig4cloud 架子，使用 @ResponseExcel注解方式组装返回数据即可，但是实现过程中发现并不是所想要的效果。

组件地址：https://github.com/pig-mesh/excel-spring-boot-starter

```java
@ResponseExcel(name = "不同Sheet的导出", sheet = {"sheet1", "sheet2"})
@PostMapping("/export")
public List<List> export(@RequestBody queryModel model) {
    model.setSize(-1);
    return userService.userExcelList(model);
}
```

组件动态修改列方案
>导出并自定义头信息
```java
@Data
public class SimpleData {
    @ExcelProperty("字符串标题")
    private String string;
    @ExcelProperty("日期标题")
    private Date date;
    @ExcelProperty("数字标题")
    private Integer number;
    // 忽略
    @ExcelIgnore
    private String ignore;
}
```
>自定义头信息生成器：

>注意需要实现 HeadGenerator 接口，且注册为一个 spring bean.
```java
@Component
public class SimpleDataHeadGenerator implements HeadGenerator {
    @Override
    public HeadMeta head(Class<?> clazz) {
        HeadMeta headMeta = new HeadMeta();
        headMeta.setHead(simpleDataHead());
        // 排除 number 属性
        headMeta.setIgnoreHeadFields(new HashSet<>(Collections.singletonList("number")));
        return headMeta;
    }

    private List<List<String>> simpleDataHead() {
        List<List<String>> list = new ArrayList<>();
        List<String> head0 = new ArrayList<>();
        head0.add("自定义字符串标题" + System.currentTimeMillis());
        List<String> head1 = new ArrayList<>();
        head1.add("自定义日期标题" + System.currentTimeMillis());
        list.add(head0);
        list.add(head1);
        return list;
    }
}
```
>该头生成器，将固定返回 自定义字符串标题 和 自定义日期标题 两列头信息，实际使用时可根据业务动态处理，方便在一些权限控制时动态修改或者增删列头。

```java
@RequestMapping("/head")
@RestController
public class ExcelHeadTestController {

    @ResponseExcel(name = "customHead", headGenerator = SimpleDataHeadGenerator.class)
    @GetMapping
    public List<SimpleData> multi() {
        List<SimpleData> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            SimpleData simpleData = new SimpleData();
            simpleData.setString("str" + i);
            simpleData.setNumber(i);
            simpleData.setDate(new Date());
            list.add(simpleData);
        }
        return list;
    }
}
```

![](https://raw.githubusercontent.com/xzMhehe/StaticFile_CDN/main/static/img/gf/20240331142833.png)


这样写能够实现多 sheet 导出，但是动态的追加列我尝试了并没有好的方案，有可能也是我没有找到，我找到的是上面动态的修改列名称。

那就只能放弃使用组件方式，自己写 EasyExcel 拦截器。

## 代码实现

### 导出工具
```java
/**
 * 多 sheet 动态追加列
 *
 * @param response      响应
 * @param dataMap       dataMap
 * @param fileName      Excel名称
 * @param sheetNameList sheet名称
 * @throws Exception Exception
 */
public static void exHealthSheetDy(HttpServletResponse response, Map<Integer, List<? extends Object>> dataMap, String fileName, List<String> sheetNameList, List<String> labelGroupName) throws Exception {
	// 表头样式
	WriteCellStyle headWriteCellStyle = new WriteCellStyle();
	// 设置表头居中对齐
	headWriteCellStyle.setHorizontalAlignment(HorizontalAlignment.CENTER);
	// 内容样式
	WriteCellStyle contentWriteCellStyle = new WriteCellStyle();
	// 设置内容剧中对齐
	contentWriteCellStyle.setHorizontalAlignment(HorizontalAlignment.CENTER);
	HorizontalCellStyleStrategy horizontalCellStyleStrategy = new HorizontalCellStyleStrategy(headWriteCellStyle, contentWriteCellStyle);
	ExcelWriter build = EasyExcel.write(getOutputStream(fileName, response))
			.excelType(ExcelTypeEnum.XLSX)
			.registerWriteHandler(horizontalCellStyleStrategy)
			.build();
	for (String s : sheetNameList) {
		WriteSheet writeSheet;
		if (s.equals("风险")) {
			// 风险
			writeSheet = EasyExcel.writerSheet(s)
					.head(HealthUserOneExcelVo.class)
					.registerWriteHandler(new LabelGroupNameRowWriteHandler(labelGroupName))
					.build();
			build.write(dataMap.get(0), writeSheet);
		} else {
			// 指标
			writeSheet = EasyExcel.writerSheet(s)
					.head(HealthUserExcelIndexVo.class)
					.build();
			build.write(dataMap.get(1), writeSheet);
		}
	}
	build.finish();
}

private static OutputStream getOutputStream(String fileName, HttpServletResponse response) throws Exception {
	fileName = URLEncoder.encode(fileName, "UTF-8");
	response.setContentType("application/vnd.ms-excel");
	response.setCharacterEncoding("utf8");
	response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");

	return response.getOutputStream();
}
```


### 拦截器
业务需求是根据 13 列切割追加列。
```java
import cn.hutool.core.util.StrUtil;
import com.alibaba.excel.write.handler.RowWriteHandler;
import com.alibaba.excel.write.metadata.holder.WriteSheetHolder;
import com.alibaba.excel.write.metadata.holder.WriteTableHolder;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 行拦截器 将字符串换成多列数据
 *
 * @author William
 */
@Slf4j
public class LabelGroupNameRowWriteHandler implements RowWriteHandler {

	/**
	 * 样式，与其他列保持一样的样式
	 */
	private CellStyle firstCellStyle;

	/**
	 * 体检标签分组列表
	 */
	private List<String> labelGroupName;

	public LabelGroupNameRowWriteHandler(List<String> labelGroupName) {
		this.labelGroupName = labelGroupName;
	}

	/**
	 * 字符串转
	 */
	@Override
	public void afterRowDispose(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Row row, Integer integer, Boolean isHead) {
		// ONE 13 行, 我的是 13 列 具体根据自己的 Excel 定位
		Cell cell = row.getCell(13);
		row.removeCell(cell);
		Map<String, Cell> map = new LinkedHashMap<>();
		int cellIndex = 0;
		for (int i = 0; i < labelGroupName.size(); i++) {
			if (StrUtil.isBlank(labelGroupName.get(i)) || map.containsKey(labelGroupName.get(i))) {
				continue;
			}
			Cell fi = row.createCell(cellIndex + 13);
			map.put(labelGroupName.get(i), fi);
			cellIndex++;
		}
		if (!isHead) {
			String stringCellValue = cell.getStringCellValue();
			try {
				String[] split = stringCellValue.split(",");
				for (Map.Entry<String, Cell> stringCellEntry : map.entrySet()) {
					boolean equalsRes = false;
					for (String s : split) {
						if (stringCellEntry.getKey().equals(s)) {
							equalsRes = true;
							break;
						}
					}
					if (equalsRes) {
						stringCellEntry.getValue().setCellValue("有");
					} else {
						stringCellEntry.getValue().setCellValue("无");
					}
				}
			} catch (Exception e) {
				log.error("afterRowDispose Exception:{}", e.getMessage(), e);
			}
		} else {
			Workbook workbook = writeSheetHolder.getSheet().getWorkbook();
			firstCellStyle = firstCellStyle(workbook);
			for (Map.Entry<String, Cell> stringCellEntry : map.entrySet()) {
				stringCellEntry.getValue().setCellValue(stringCellEntry.getKey());
				stringCellEntry.getValue().setCellStyle(firstCellStyle);
				stringCellEntry.getValue().setCellStyle(firstCellStyle);
				stringCellEntry.getValue().setCellStyle(firstCellStyle);
			}
		}
	}

	/**
	 * excel首列序号列样式
	 *
	 * @param workbook Workbook
	 * @return CellStyle
	 */
	public CellStyle firstCellStyle(Workbook workbook) {
		CellStyle cellStyle = workbook.createCellStyle();

		// 居中
		cellStyle.setAlignment(HorizontalAlignment.CENTER);
		cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		//  灰色
		cellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());

		// 设置边框
		cellStyle.setBorderBottom(BorderStyle.THIN);
		cellStyle.setBorderLeft(BorderStyle.THIN);
		cellStyle.setBorderRight(BorderStyle.THIN);
		cellStyle.setBorderTop(BorderStyle.THIN);

		// 文字
		Font font = workbook.createFont();
		font.setFontHeightInPoints((short) 14);
		font.setFontName("宋体");
		font.setBold(Boolean.TRUE);
		cellStyle.setFont(font);

		return cellStyle;
	}

	@Override
	public void beforeRowCreate(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Integer integer, Integer integer1, Boolean aBoolean) {
	}

	@Override
	public void afterRowCreate(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Row row, Integer integer, Boolean aBoolean) {
	}
}
```