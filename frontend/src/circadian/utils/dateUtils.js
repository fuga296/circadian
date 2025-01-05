export const formatN = num => {
    return new Intl.NumberFormat('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    }).format(num);
}

export const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];