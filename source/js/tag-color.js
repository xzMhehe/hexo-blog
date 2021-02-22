// 彩色标签云
var allTags = document.getElementsByClassName('tag-list');
if (allTags.length > 0) {
    var colors = ['#a1c4fd, #c2e9fb', '#fdcbf1, #fdcbf1, #e6dee9', '#e0c3fc, #8ec5fc',
        '#cd9cf2, #f6f3ff']
    var tags = allTags[0].getElementsByTagName('a');
    for (var i = tags.length - 1; i >= 0; i--) {
        var colorGradient = colors[Math.floor(Math.random() * colors.length)];
        tags[i].style.background = "linear-gradient(to right, " + colorGradient + ")";
        tags[i].style.color = "#fff";
    }
}
