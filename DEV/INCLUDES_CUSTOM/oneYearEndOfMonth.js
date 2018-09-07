function oneYearEndOfMonth() {
    var today = new Date();
    var yearFromToday = new Date(today.setFullYear(today.getFullYear() + 1));
    var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDayOfMonth;
}