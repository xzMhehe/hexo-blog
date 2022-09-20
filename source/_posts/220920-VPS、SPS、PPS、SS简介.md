---
title: 【音视频】VPS、SPS、PPS、SS简介
date: 2022-09-20 08:09:56
tags: 音视频
categories: [音视频]
---

<table>
<thead>
<tr>
<th style="text-align:center">缩写</th>
<th style="text-align:center">全称</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">GOP</td>
<td style="text-align:center">group of pictures</td>
</tr>
<tr>
<td style="text-align:center">IDR</td>
<td style="text-align:center">instantaneous decoding refresh</td>
</tr>
<tr>
<td style="text-align:center">SS</td>
<td style="text-align:center">slice segment</td>
</tr>
<tr>
<td style="text-align:center">CTU</td>
<td style="text-align:center">coding tree unit</td>
</tr>
<tr>
<td style="text-align:center">SPS</td>
<td style="text-align:center">sequence parameter set, 序列参数集(解码相关信息，档次级别、分别率、某档次中编码工具开关标识和涉及的参数、时域可分级信息等)</td>
</tr>
<tr>
<td style="text-align:center">PPS</td>
<td style="text-align:center">picture parameter set, 图像参数集（一幅图像所用的公共参数，一幅图像中所有SS应用同一个PPS,初始图像控制信息，初始化参数、分块信息）</td>
</tr>
<tr>
<td style="text-align:center">CVS</td>
<td style="text-align:center">coded video sequence</td>
</tr>
<tr>
<td style="text-align:center">QP</td>
<td style="text-align:center">quantization parameter</td>
</tr>
<tr>
<td style="text-align:center">VPS</td>
<td style="text-align:center">video parameter set</td>
</tr>
</tbody>
</table>

![](https://upload-images.jianshu.io/upload_images/3596589-c5cd27c205844162.png?imageMogr2/auto-orient/strip|imageView2/2/w/888/format/webp)

## VPS
一个给定的视频序列,无论它每一层的SPS是否相同,都参考相同
的PS。VPS包含的信息有:
- 多个子层和操作点共享的语法元素

- 会话所需的有关操作点的关键信息,如档次、级别:

- 其他不属于SPS的操作点特性信息,例如与多层或子层相关的虚拟参考解码器( Hypothetical Reference Decoder,HRD)参数。对每个操作点的关键信息的编码,不要求可变长编码,这样有利于减轻大多数网络组成单元的负担。H265/HEVC的扩展版本将会在当前PS中添加更多的语法元素,以使会话更加灵活高效并使编码码率具有更高的自适应性。

<table>
<thead>
<tr>
<th style="text-align:center">缩写</th>
<th style="text-align:center">全称</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">ae(ⅴ)</td>
<td style="text-align:center">基于上下文自适应的二元算术编码。</td>
</tr>
<tr>
<td style="text-align:center">b(8)</td>
<td style="text-align:center">读进连续的8bit</td>
</tr>
<tr>
<td style="text-align:center">f(n)</td>
<td style="text-align:center">读进连续的nbit</td>
</tr>
<tr>
<td style="text-align:center">se(ν)</td>
<td style="text-align:center">有符号指数 Golomb熵编码</td>
</tr>
<tr>
<td style="text-align:center">u(n)</td>
<td style="text-align:center">读进连续的nbit,且它们解码后的值为无符号整数</td>
</tr>
<tr>
<td style="text-align:center">ue(m)</td>
<td style="text-align:center">无符号指数 Golomb熵编码。</td>
</tr>
</tbody>
</table>

## SPS
SPS中所含的语法元素,其内容大致分为以下几个部分。
- 图像格式的信息。包括采样格式、图像分辨率、量化深度、解码图像是否需要裁剪输出以及相关的裁剪参数。

- 编码参数信息。包括编码块、变换块的最小尺寸和最大尺寸,帧内、帧间预测编码时变换块的最大划分深度,对4:4:4采样格式的三个通道分量是否单独编码,是否需要帧内强滤波,帧间预测过程中的某些限制条件[如非对称模式(AMP)的使用、时域MV预测的使用]是否使用量化矩阵,是否需要样点自适应补偿(SAO),是否采用PCM模式及在该模式下的相关编码参数。

- `与参考图像相关的信息`。包括短期参考图像的设置,长期参考图像的使用和数目,长期参考图像的POC和其能否作为当前图像的参考图像。

- `档次、层和级相关参数`。具体内容见38节。

- `时域分级信息`。包括时域子层的最大数目,控制传输POC进位的参数,时域子层顺序标识开关,与子层相关的参数(如解码图像缓冲区的最大需求)。

- `可视化可用性信息`( Video Usability Information,wUI),用于表征视频格式等额外信息

- `其他信息`。包括当前SPS引用的VPS编号、SPS标识号和SPS扩展信息。

## PPS
PPS中所涉及的具体的语法元素,图像参数集的内容大致分为以下几个部分
- 编码工具的可用性标志。指明片头中一些工具是否可用。这些编码工具主要包括符号位隐藏、帧内预测受限、去方块滤波、PB图像的加权预测、环路滤波跨越片边界或者Tile边界、 Transform skip模式和Transquant bypass模式。

- `量化过程相关句法元素`。包括每个Slce中QP初始值的设定以及计算每个CU的QP时所需的参数。此外,还有亮度量化参数的偏移量和由它导出的色度量化参数的偏移量等。有关量化过程中QP的具体计算。

- `Tile相关句法元素`。包括Tile划分模式的可用性标志,以及在使用Tile划分模式时的一些参数,例如Tile的划分形式,总行数、总列数及第几行、第几列的标识等。

- `去方块滤波相关句法元素`。包括去方块滤波的可用性标志以及使用去方块滤波时的一些控制信息和参数,如去方块滤波的默认补偿值β和tC

- `片头中的控制信息`。包括当前片是否为依赖片、片头中是否有额外的 Slice头比特、图像解码顺序与输出顺序的先后关系以及 CABAC中确定上下文变量初始化表格时使用的方法等。

- `其他编码一幅图像时可以共用的信息`。包括ID标识符、参考图像的数目和并行产生 merge候选列表的能力等。其中ID标识符用于标识当前活动的参数集,主要是当前活动的PPS的自身ID和其引用的SPS的ID。此外,PPS中还包括变换矩阵信息是否存在的标志位,这一变换矩阵信息若存在,便会对SPS中的该信息进行覆盖。


## Slice
一幅图像可以被分割为一个或多个片( Slice),每个片的压缩数据都是独立的, Slice头信息无法通过前一个Sice的头信息推断得到。这就要求 Slice不能跨过它的边界来进行帧内或帧间预测,且在进行熵编码前需要进行初始化。但在进行`环路滤波`时,允许滤波器`跨越 Slice的边界`进行滤波。除了 Slice的边界可能受环路滤波影响外, Slice的解码过程可以不使用任何来自其他 Slice的影响,且有利于实现并行运算。`使用 Slice的主要目的是当数据丢失后能再次保证解码同步。`

根据编码类型不同, Slice可分为以下几部分。
- `I Slice`:该 Slice中所有CU的编码过程都使用帧内预测。

- `P Slice`:在 I Slice的基础上,该 Slice中的CU还可以使用帧间预测测,每个预测块(PB)使用至多一个运动补偿预测信息。 P Slice只使用图像参考列表list0

- `B Slice`:在 P Slice的基础上, B Slice中的CU也可以使用帧间预测,但是每个PB可以使用至多两个运动补偿预测信息。 B Slice可以使用图像参考列表list0和list1。


![](https://upload-images.jianshu.io/upload_images/3596589-e25213325bb76575.png?imageMogr2/auto-orient/strip|imageView2/2/w/966/format/webp)

## Tile
H.265/HEVC对H.264/AVC的改进之处还在于Tile概念的提出。一幅图像不仅可以划分为若干个 Slice,也可以划分为若干个Tile。即从水平和垂直方向将一幅图像分割为若干个矩形区域,一个矩形区域就是一个Tile。每个Tile包含整数个CTU,其可以独立解码。划分Tile的主要目的是在增强并行处理能力的同时又不引入新的错误扩散。Tile提供比CTB更大程度的并行(在图像或者子图像的层面上),在使用时无须进行复杂的线程同步


Tile的划分并不要求水平和垂直边界均匀分布,可根据并行计算和差错控制的要求灵活掌握。通常情况下,每一个Tile中包含的CTU数据是近似相等的。在编码时,图像中的所有Tile按照扫描顺序进行处理,每个Tile中的CTU也按照扫描顺序进行编码。一个Tile包含的CTU个数和 Slice中的CTU个数互不影响。 这是3×3的划分,整幅图像被划分为9个Tile,每个Tile都为矩形。在同一幅图像中,可以同时存在某些 Slice中包含多个Tile和某些Tile中包含多个 Slice的情况。


![](https://upload-images.jianshu.io/upload_images/3596589-71d5675c2e893cce.png?imageMogr2/auto-orient/strip|imageView2/2/w/909/format/webp)

## Slice 与 Tile的关系
在H265/HEVC中, Slice和Tle划分的目的都是为了进行独立解码但是二者的划分方式又有所不同。Tile形状基本上为矩形, Slice的形状则为条带状。 Slice由一系列的SS组成,一个SS由一系列的CTU组成Tile则直接由一系列的CTU组成。 Slice/ss和Tile之间必须遵守一些基本原则,每个 Slice/SS和Tile至少要满足以下两个条件之一。

- 一个 Slice/ss中的所有CTU属于同一个Tile

- 一个Tie中的所有CTU属于同一个 Slice/SS。

下面的例子将分别对同一幅图像中的 Slice和Tile划分做详细说明。
![](https://upload-images.jianshu.io/upload_images/3596589-6dc8adbbea023c6a.png?imageMogr2/auto-orient/strip|imageView2/2/w/707/format/webp)