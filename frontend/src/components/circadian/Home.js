import './Home.css'

const Home = () => {

    return (
        <div className='home' id="contentContainer">
            <header>
                <h1 id="title">ホーム</h1>
            </header>

            <main>
                <h2>できること</h2>
                <ol>
                    <li>日記を追加する</li>
                    <li>日記を編集する</li>
                    <li>ブロック、リスト、カレンダーで日記を閲覧する</li>
                    <li>日記を検索する</li>
                </ol>
            </main>
        </div>
    )
}

export default Home;