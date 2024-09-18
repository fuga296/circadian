import homeIcon from '../images/home.svg';
import readDiaryIcon from '../images/book.svg';
import readListIcon from '../images/list.svg';
import calendarIcon from '../images/calendar.svg';
import addDiaryIcon from '../images/pen.svg';
import settingIcon from '../images/gear.svg';
import termOfUseIcon from '../images/file-text.svg';
import logoutIcon from '../images/door-open.svg';
import feedbackIcon from '../images/send.svg';

export const NAV_SELECTION_LIST = [
    [
        {
            page: 'home',
            icon: homeIcon,
            text: 'ホーム',
        },
        {
            page: 'read-diary',
            icon: readDiaryIcon,
            text: '日記を見る',
        },
        {
            page: 'read-list',
            icon: readListIcon,
            text: 'リストを見る',
        },
        {
            page: 'calendar',
            icon: calendarIcon,
            text: 'カレンダー',
        },
        {
            page: 'add-diary',
            icon: addDiaryIcon,
            text: '日記を追加',
        },
    ],
    [
        {
            page: 'setting',
            icon: settingIcon,
            text: '設定',
        },
        {
            page: 'term-of-use',
            icon: termOfUseIcon,
            text: '利用規約',
        },
        {
            page: 'logout',
            icon: logoutIcon,
            text: 'ログアウト',
        },
        {
            page: 'feedback',
            icon: feedbackIcon,
            text: 'フィードバック',
        },
    ]
]