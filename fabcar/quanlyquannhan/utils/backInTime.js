//시간을 거슬러

function backInTime(backToYear) {
    let today = new Date();
    today.setFullYear(today.getFullYear() - backToYear);
    return today.getTime();
}
module.exports.backInTime = backInTime;