import * as moment from "moment";

export const dateDiff = (_date1, _date2) => {
  let time1 = new Date(_date1).toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  time1 = new Date(time1);

  let time2 = new Date(_date2).toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  time2 = new Date(time2);

  const utc1 = Date.UTC(time1.getFullYear(), time1.getMonth(), time1.getDate());
  const utc2 = Date.UTC(time2.getFullYear(), time2.getMonth(), time2.getDate());

  return Math.floor((utc2 - utc1) / (1000 * 3600 * 24));
};

const leadingZeros = (n, digits) => {
  let zero = "";
  n = n.toString();

  if (n.length < digits) {
    for (let i = 0; i < digits - n.length; i++) zero += "0";
  }
  return zero + n;
};

export const todayDate = () => {
  const today = new Date();

  const result = `${leadingZeros(today.getFullYear(), 4)}-${leadingZeros(
    today.getMonth() + 1,
    2,
  )}-${leadingZeros(today.getDate(), 2)}`;

  return result;
};

export const nextMonth = (today, num) => {
  const before = new Date(today);
  const year = leadingZeros(before.getFullYear(), 4);
  const month = leadingZeros(before.getMonth() + 1 + num, 2);
  const date = leadingZeros(before.getDate(), 2);
  let next = "";
  if (month > 12) {
    const newMonth = leadingZeros(month - 12, 2);
    next = `${Number(year) + 1}-${newMonth}-${date}`;
    return next;
  }
  next = `${year}-${month}-${date}`;
  return next;
};

export const getTimeStamp = () => {
  const d = new Date();

  const s = `${leadingZeros(d.getFullYear(), 4)}-${leadingZeros(
    d.getMonth() + 1,
    2,
  )}-${leadingZeros(d.getDate(), 2)} ${leadingZeros(
    d.getHours(),
    2,
  )}:${leadingZeros(d.getMinutes(), 2)}:${leadingZeros(d.getSeconds(), 2)}`;

  return s;
};

export const filterDateStr = (date, format) => {
  if (format === undefined) {
    format = "YYYY-MM-DD";
  }
  const newdate = moment(new Date(date)).format(format);
  if (newdate === "Invalid date") {
    return date;
  }
  return newdate;
};

export const yearMake = () => {
  const now = Number(moment().format("YYYY"));
  const start = 2017;
  const arr = [];
  for (let i = start; i <= now; i++) {
    arr.push(i);
  }
  return arr;
};

export const monthList = () => {
  const month = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  return month;
};
