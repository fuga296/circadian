import homeIcon from './../assets/images/home.svg';
import readDiaryIcon from './../assets/images/book.svg';
import readListIcon from './../assets/images/list.svg';
import calendarIcon from './../assets/images/calendar.svg';
import addDiaryIcon from './../assets/images/pen.svg';
import settingIcon from './../assets/images/gear.svg';
import termOfUseIcon from './../assets/images/file-text.svg';
import logoutIcon from './../assets/images/door-open.svg';
import feedbackIcon from './../assets/images/send.svg';

export const NAV_SELECTION_LISTS = [
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
            page: 'terms-of-use',
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