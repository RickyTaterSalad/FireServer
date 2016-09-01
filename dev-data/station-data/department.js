var dateUtils = require("../../util/date-utils");

module.exports = {
    department: {
        name: "LAFD",
        platoons: [
            "A",
            "B",
            "C"
        ],
        schedule: {
            name: "Schedule Name",
            numberOfPlatoons: 3,
            platoonSchedule: "A,C,A,B,A,B,C,B,C",
            shiftLengthInHours: 24,
            shiftStartTime: "0800",
            platoonScheduleStartDate: dateUtils.dateFromDayMonthYear(25, 6, 2016),
            platoonColorCodes: [
                {platoon: "A", hexColor: "#ff0000"},
                {platoon: "B", hexColor: "#0000ff"},
                {platoon: "C", hexColor: "#00897B"}
            ]

        }
    }
};