$(function () {
    var botui = new BotUI("hello-xinze");
    botui.message.add({delay: 800, content: "Hi, there👋"}).then(function () {
        botui.message.add({delay: 1100, content: "这里是博主小屋✨ "}).then(function () {
            botui.message.add({delay: 1100, content: "一个积极向上的Boy~~"}).then(function () {
                botui.action.button({
                    delay: 1600,
                    action: [{text: "然后呢？ 😃", value: "sure"}, {text: "少废话！ 🙄", value: "skip"}]
                }).then(function (a) {
                    "sure" == a.value && sure();
                    "skip" == a.value && end()
                })
            })
        })
    });
    var sure = function () {
        botui.message.add({delay: 600, content: "😘"}).then(function () {
            secondPart()
        })
    }, end = function () {
        botui.message.add({
            delay: 600,
            content: "告辞了您嘞！"
        })
    }, secondPart = function () {
        botui.message.add({delay: 1500, content: "现就读于天津理工大学"}).then(function () {
            botui.message.add({delay: 1500, content: "一枚标准95后程序猿"}).then(function () {
                botui.message.add({delay: 1200, content: "将敲代码看成一种快乐"}).then(function () {
                    botui.message.add({
                        delay: 1500,
                        content: "拥有一年 Java 开发经验，熟练使用 Spring Boot 框架，了解 Redis 等缓存组件。"
                    }).then(function () {
                        botui.message.add({delay: 1800, content: "喜欢听音乐、接触新事物、打游戏"}).then(function () {
                            botui.action.button({
                                delay: 1100,
                                action: [{text: "个人简介是什么呢？🤔", value: "what-info"}]
                            }).then(function () {
                                thirdPart()
                            })
                        })
                    })
                })
            })
        })
    }, thirdPart = function () {
        botui.message.add({delay: 1e3, content: "生活可能不像你想象的那么好, 但是也是不会像你想象的那么糟 ~"}).then(function () {
            botui.action.button({delay: 1500, action: [{text: "域名有什么含义吗？", value: "why-domain"}]}).then(function (a) {
                fourthPart()
            })
        })
    }, fourthPart = function () {
        botui.message.add({delay: 1e3, content: "emmmmm，code create life 😃"}).then(function () {
            botui.message.add({delay: 1600, content: "那么，相遇就是缘分，赏个赞吧 ^_^"})
        })
    }
})
