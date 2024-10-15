const apps = [
    {name: "Circadian", url: "circadian/home", description: "完成度が低いので使用を控えてください"},
    {name: "Warning", url: "cheering/warning", description: ""},
    // {name: "Message", url: "cheering/message", description: ""},
]

const RootRoutes = () => {
    return (
        <div>
            <h1>ルートルート</h1>
            <ul>
                {apps.map((app, index) => (
                    <li key={index}><a href={app.url}>{app.name}</a> {app.description}</li>
                ))}
            </ul>
        </div>
    )
}

export default RootRoutes;

// setting, roottoutes, message, warning, approutes, cheering, app, circadian