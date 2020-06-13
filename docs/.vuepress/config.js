module.exports = {
    base: "/replikit/",
    title: "Replikit",
    description:
        "A powerful framework for building universal strongly typed bots",
    locales: {
        "/": {
            lang: "en-US"
        },
        "/ru/": {
            lang: "ru-RU"
        }
    },
    themeConfig: {
        locales: {
            "/": {
                label: "English",
                nav: [
                    {
                        text: "Guide",
                        link: "/guide/"
                    },
                    {
                        text: "Github",
                        link: "https://github.com/Exeteres/replikit"
                    }
                ]
            },
            "/ru/": {
                label: "Русский",
                nav: [
                    {
                        text: "Руководство",
                        link: "/ru/guide/"
                    },
                    {
                        text: "Github",
                        link: "https://github.com/Exeteres/replikit"
                    }
                ],
                sidebarDepth: 2,
                sidebar: [
                    "/ru/guide/",
                    "/ru/guide/installation",
                    {
                        title: "Использование",
                        collapsable: false,
                        children: [
                            "/ru/guide/usage/routing",
                            "/ru/guide/usage/messages",
                            "/ru/guide/usage/commands",
                            "/ru/guide/usage/storage",
                            "/ru/guide/usage/access-control",
                            "/ru/guide/usage/i18n",
                            "/ru/guide/usage/cli",
                            "/ru/guide/usage/core",
                            "/ru/guide/usage/controllers"
                        ]
                    }
                ]
            }
        }
    }
};
