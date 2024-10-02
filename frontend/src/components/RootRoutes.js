const apps = [["Circadian", "circadian/home"]]

const RootRoutes = () => {
    return (
        <div>
            <h1>ルートルート</h1>
            <ul>
                {apps.map((app, index) => (
                    <li><a href={app[1]} key={index}>{app[0]}</a></li>
                ))}
            </ul>
        </div>
    )
}

export default RootRoutes;

// AppRoutes、RootRoutes、App