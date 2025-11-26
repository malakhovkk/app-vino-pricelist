import { useEffect, useState } from "react";
import { formatDate } from "devextreme/localization";
import { Button, DateBox, Popup, SelectBox, TextBox } from "devextreme-react";
import {
  createStaff,
  getStaff,
  editStaff,
  editPointsInfo,
  getStaffPointsById,
} from "../../restApi";
import { deleteStaff } from "../../restApi";
import DataGrid, {
  Editing,
  Column,
  Item,
  Toolbar,
  Selection,
} from "devextreme-react/data-grid";
import Scheduler, { Resource, View } from "devextreme-react/scheduler";
import { addSchedule } from "../../restApi";
import { getSchedule, editSchedule } from "../../restApi";
import "devextreme/dist/css/dx.light.css";
import moment from "moment";
import { deleteSchedule } from "../../restApi";
import { GetStocks, getScheduleById } from "../../restApi";
import { addToPointsInfo, getPointsInfo } from "../../restApi";
import { addStaffPoints, deleteStaffPoints } from "../../restApi";
import { deletePoints } from "../../restApi";
export default function Staff() {
  const appointments = [
    {
      title: "Install New Database",
      startDate: new Date("2021-05-23T08:45:00.000Z"),
      endDate: new Date("2021-05-23T09:45:00.000Z"),
    },
    {
      title: "Create New Online Marketing Strategy",
      startDate: new Date("2021-05-24T09:00:00.000Z"),
      endDate: new Date("2021-05-24T11:00:00.000Z"),
    },
    {
      title: "Upgrade Personal Computers",
      startDate: new Date("2021-05-25T10:15:00.000Z"),
      endDate: new Date("2021-05-25T13:30:00.000Z"),
    },
    {
      title: "Customer Workshop",
      startDate: new Date("2021-05-26T08:00:00.000Z"),
      endDate: new Date("2021-05-26T10:00:00.000Z"),
      dayLong: true,
      recurrence: "FREQ=WEEKLY;BYDAY=TU,FR;COUNT=10",
    },
    {
      title: "Prepare Development Plan",
      startDate: new Date("2021-05-27T08:00:00.000Z"),
      endDate: new Date("2021-05-27T10:30:00.000Z"),
    },
    {
      title: "Testing",
      startDate: new Date("2021-05-23T09:00:00.000Z"),
      endDate: new Date("2021-05-23T10:00:00.000Z"),
      recurrence: "FREQ=WEEKLY;INTERVAL=2;COUNT=2",
    },
    {
      title: "Meeting of Instructors",
      startDate: new Date("2021-05-24T10:00:00.000Z"),
      endDate: new Date("2021-05-24T11:15:00.000Z"),
      recurrence: "FREQ=DAILY;BYDAY=WE;UNTIL=20211001",
    },
    {
      title: "Recruiting students",
      startDate: new Date("2021-05-25T08:00:00.000Z"),
      endDate: new Date("2021-05-25T09:00:00.000Z"),
      recurrence: "FREQ=YEARLY",
    },
    {
      title: "Monthly Planning",
      startDate: new Date("2021-05-26T09:30:00.000Z"),
      endDate: new Date("2021-05-26T10:45:00.000Z"),
      recurrence: "FREQ=MONTHLY;BYMONTHDAY=28;COUNT=1",
    },
    {
      title: "Open Day",
      startDate: new Date("2021-05-27T09:30:00.000Z"),
      endDate: new Date("2021-05-27T19:00:00.000Z"),
    },
  ];
  const [addStaffPopUp, setAddStaffPopUp] = useState(false);
  const [changeStaffPopUp, setChangeStaffPopUp] = useState(false);
  const [user, setUser] = useState({});
  const [staff, setStaff] = useState([]);
  const [selected, setSelected] = useState({});
  const addStaff = () => {
    setAddStaffPopUp(true);
  };
  const textbox_data = [
    { name1: "firstname", dataCaption: "Имя" },
    { name1: "lastname", dataCaption: "Фамилия" },
    { name1: "middlename", dataCaption: "Отчество" },
    {
      name1: "datefrom",
      type: "date",
      dataCaption: "Дата, с которой работает",
    },
  ];

  const [shops, setShops] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  const [sel, setSel] = useState({});
  const [scheduleData, setScheduleData] = useState();
  useEffect(() => {
    (async () => {
      setShops(await GetStocks());
    })();
  }, [showSchedule]);

  const send_addstaff = async () => {
    // const user2 = user;
    if (!user.firstname || !user.lastname || !user.middlename || !user.datefrom)
      return;
    const user2 = { ...user };
    console.log(user);
    // console.log(formatDate(user.datefrom, "dd-MM-yyyy"));
    user2.datefrom = formatDate(new Date(user.datefrom), "dd-MM-yyyy");
    console.log(user2);
    try {
      await createStaff(user2);
      const rows = await getStaff();
      setStaff(rows);
      console.log(rows);
    } catch (error) {
      console.log(error);
    }
    console.log(user2);
  };

  const changeStaff = () => {
    setChangeStaffPopUp(true);
  };

  useEffect(() => {
    (async () => {
      const rows = await getStaff();
      console.log(rows);
      setStaff(rows);
    })();
  }, []);

  const changeStaff_save = async () => {
    try {
      console.log(selected);
      await editStaff({
        ...selected,
        datefrom: formatDate(new Date(selected.datefrom), "dd-MM-yyyy"),
      });
      const rows = await getStaff();
      setStaff(rows);
      setSelected({});
      setChangeStaffPopUp(false);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selected);

  const removeStaff = async () => {
    if (!window.confirm("Вы правда хотите удалить?")) return;
    try {
      await deleteStaff(selected.personid);
      const rows = await getStaff();
      setStaff(rows);
    } catch (error) {
      console.log(error);
    }
  };

  const views = [
    // "timelineDay",
    // "timelineWeek",
    // "timelineWorkWeek",
    "timelineMonth",
  ];
  //   const currentDate = new Date();
  const groups = ["person"];

  const data = [
    {
      text: "Work",
      type: 1,
      startDate: new Date("2021-02-01T00:00:00.000Z"),
      endDate: new Date("2021-02-04T00:00:00.000Z"),
      person: 1,
    },
    {
      text: "Holiday",
      type: 2,
      startDate: new Date("2021-02-01T00:30:00.000Z"),
      endDate: new Date("2021-02-01T09:45:00.000Z"),
      person: 3,
    },
    {
      text: "Not work",
      type: 3,
      startDate: new Date("2021-02-01T21:15:00.000Z"),
      endDate: new Date("2021-02-02T22:15:00.000Z"),
      person: 3,
    },
    {
      text: "Website Re-Design Plan",
      startDate: new Date("2021-02-01T23:45:00.000Z"),
      endDate: new Date("2021-02-02T18:15:00.000Z"),
      person: 2,
    },
    {
      text: "Rollout of New Website and Marketing Brochures",
      startDate: new Date("2021-02-02T15:15:00.000Z"),
      endDate: new Date("2021-02-02T17:45:00.000Z"),
      person: 2,
    },
    {
      text: "Update Sales Strategy Documents",
      startDate: new Date("2021-02-02T19:00:00.000Z"),
      endDate: new Date("2021-02-02T20:45:00.000Z"),
      person: 1,
    },
    {
      text: "Non-Compete Agreements",
      startDate: new Date("2021-02-03T16:15:00.000Z"),
      endDate: new Date("2021-02-03T17:00:00.000Z"),
      person: 1,
    },
    {
      text: "Approve Hiring of John Jeffers",
      startDate: new Date("2021-02-03T17:00:00.000Z"),
      endDate: new Date("2021-02-03T18:15:00.000Z"),
      person: 2,
    },
    {
      text: "Update NDA Agreement",
      startDate: new Date("2021-02-03T18:45:00.000Z"),
      endDate: new Date("2021-02-03T20:45:00.000Z"),
      person: 2,
    },
    {
      text: "Update Employee Files with New NDA",
      startDate: new Date("2021-02-03T21:00:00.000Z"),
      endDate: new Date("2021-02-03T23:45:00.000Z"),
      person: 1,
    },
    {
      text: "Submit Questions Regarding New NDA",
      startDate: new Date("2021-02-05T01:00:00.000Z"),
      endDate: new Date("2021-02-04T16:30:00.000Z"),
      person: 1,
    },
    {
      text: "Submit Signed NDA",
      startDate: new Date("2021-02-04T19:45:00.000Z"),
      endDate: new Date("2021-02-04T21:00:00.000Z"),
      person: 1,
    },
    {
      text: "Review Revenue Projections",
      startDate: new Date("2021-02-05T00:15:00.000Z"),
      endDate: new Date("2021-02-04T15:00:00.000Z"),
      person: 2,
    },
    {
      text: "Comment on Revenue Projections",
      startDate: new Date("2021-02-05T16:15:00.000Z"),
      endDate: new Date("2021-02-05T18:15:00.000Z"),
      person: 1,
    },
    {
      text: "Provide New Health Insurance Docs",
      startDate: new Date("2021-02-05T19:45:00.000Z"),
      endDate: new Date("2021-02-05T21:15:00.000Z"),
      person: 2,
    },
    {
      text: "Review Changes to Health Insurance Coverage",
      startDate: new Date("2021-02-05T21:15:00.000Z"),
      endDate: new Date("2021-02-05T22:30:00.000Z"),
      person: 1,
    },
    {
      text: "Review Training Course for any Omissions",
      startDate: new Date("2021-02-08T21:00:00.000Z"),
      endDate: new Date("2021-02-09T19:00:00.000Z"),
      person: 2,
    },
    {
      text: "Recall Rebate Form",
      startDate: new Date("2021-02-08T19:45:00.000Z"),
      endDate: new Date("2021-02-08T20:15:00.000Z"),
      person: 1,
    },
    {
      text: "Create Report on Customer Feedback",
      startDate: new Date("2021-02-09T22:15:00.000Z"),
      endDate: new Date("2021-02-10T00:30:00.000Z"),
      person: 2,
    },
    {
      text: "Review Customer Feedback Report",
      startDate: new Date("2021-02-09T23:15:00.000Z"),
      endDate: new Date("2021-02-10T01:30:00.000Z"),
      person: 1,
    },
    {
      text: "Customer Feedback Report Analysis",
      startDate: new Date("2021-02-10T16:30:00.000Z"),
      endDate: new Date("2021-02-10T17:30:00.000Z"),
      person: 1,
    },
    {
      text: "Prepare Shipping Cost Analysis Report",
      startDate: new Date("2021-02-10T19:30:00.000Z"),
      endDate: new Date("2021-02-10T20:30:00.000Z"),
      person: 1,
    },
    {
      text: "Provide Feedback on Shippers",
      startDate: new Date("2021-02-10T21:15:00.000Z"),
      endDate: new Date("2021-02-10T23:00:00.000Z"),
      person: 2,
    },
    {
      text: "Select Preferred Shipper",
      startDate: new Date("2021-02-11T00:30:00.000Z"),
      endDate: new Date("2021-02-11T03:00:00.000Z"),
      person: 1,
    },
    {
      text: "Complete Shipper Selection Form",
      startDate: new Date("2021-02-11T15:30:00.000Z"),
      endDate: new Date("2021-02-11T17:00:00.000Z"),
      person: 2,
    },
    {
      text: "Upgrade Server Hardware",
      startDate: new Date("2021-02-11T19:00:00.000Z"),
      endDate: new Date("2021-02-11T21:15:00.000Z"),
      person: 1,
    },
    {
      text: "Upgrade Personal Computers",
      startDate: new Date("2021-02-11T21:45:00.000Z"),
      endDate: new Date("2021-02-11T23:30:00.000Z"),
      person: 1,
    },
    {
      text: "Upgrade Apps to Windows RT or stay with WinForms",
      startDate: new Date("2021-02-12T17:30:00.000Z"),
      endDate: new Date("2021-02-12T20:00:00.000Z"),
      person: 1,
    },
    {
      text: "Estimate Time Required to Touch-Enable Apps",
      startDate: new Date("2021-02-12T21:45:00.000Z"),
      endDate: new Date("2021-02-12T23:30:00.000Z"),
      person: 1,
    },
    {
      text: "Report on Tranistion to Touch-Based Apps",
      ownerId: [2],
      startDate: new Date("2021-02-13T01:30:00.000Z"),
      endDate: new Date("2021-02-13T02:00:00.000Z"),
      person: 1,
    },
    {
      text: "Submit New Website Design",
      startDate: new Date("2021-02-15T15:00:00.000Z"),
      endDate: new Date("2021-02-15T17:00:00.000Z"),
      person: 2,
    },
    {
      text: "Create Icons for Website",
      startDate: new Date("2021-02-15T18:30:00.000Z"),
      endDate: new Date("2021-02-15T20:15:00.000Z"),
      person: 1,
    },
    {
      text: "Create New Product Pages",
      startDate: new Date("2021-02-16T16:45:00.000Z"),
      endDate: new Date("2021-02-16T18:45:00.000Z"),
      person: 2,
    },
    {
      text: "Approve Website Launch",
      startDate: new Date("2021-02-16T19:00:00.000Z"),
      endDate: new Date("2021-02-16T22:15:00.000Z"),
      person: 1,
    },
    {
      text: "Update Customer Shipping Profiles",
      startDate: new Date("2021-02-17T16:30:00.000Z"),
      endDate: new Date("2021-02-17T18:00:00.000Z"),
      person: 1,
    },
    {
      text: "Create New Shipping Return Labels",
      startDate: new Date("2021-02-17T19:45:00.000Z"),
      endDate: new Date("2021-02-17T21:00:00.000Z"),
      person: 1,
    },
    {
      text: "Get Design for Shipping Return Labels",
      startDate: new Date("2021-02-17T22:00:00.000Z"),
      endDate: new Date("2021-02-17T23:30:00.000Z"),
      person: 1,
    },
    {
      text: "PSD needed for Shipping Return Labels",
      startDate: new Date("2021-02-18T15:30:00.000Z"),
      endDate: new Date("2021-02-18T16:15:00.000Z"),
      person: 2,
    },
    {
      text: "Contact ISP and Discuss Payment Options",
      startDate: new Date("2021-02-18T18:30:00.000Z"),
      endDate: new Date("2021-02-18T23:00:00.000Z"),
      person: 2,
    },
    {
      text: "Prepare Year-End Support Summary Report",
      startDate: new Date("2021-02-19T00:00:00.000Z"),
      endDate: new Date("2021-02-19T03:00:00.000Z"),
      person: 1,
    },
    {
      text: "Review New Training Material",
      startDate: new Date("2021-02-19T15:00:00.000Z"),
      endDate: new Date("2021-02-19T16:15:00.000Z"),
      person: 2,
    },
    {
      text: "Distribute Training Material to Support Staff",
      startDate: new Date("2021-02-19T19:45:00.000Z"),
      endDate: new Date("2021-02-19T21:00:00.000Z"),
      person: 1,
    },
    {
      text: "Training Material Distribution Schedule",
      startDate: new Date("2021-02-19T21:15:00.000Z"),
      endDate: new Date("2021-02-19T23:15:00.000Z"),
      person: 1,
    },
    {
      text: "Approval on Converting to New HDMI Specification",
      startDate: new Date("2021-02-22T16:30:00.000Z"),
      endDate: new Date("2021-02-22T17:15:00.000Z"),
      person: 2,
    },
    {
      text: "Create New Spike for Automation Server",
      ownerId: [3],
      startDate: new Date("2021-02-22T17:00:00.000Z"),
      endDate: new Date("2021-02-22T19:30:00.000Z"),
      person: 2,
    },
    {
      text: "Code Review - New Automation Server",
      startDate: new Date("2021-02-22T20:00:00.000Z"),
      endDate: new Date("2021-02-22T22:00:00.000Z"),
      person: 1,
    },
    {
      text: "Confirm Availability for Sales Meeting",
      startDate: new Date("2021-02-23T17:15:00.000Z"),
      endDate: new Date("2021-02-23T22:15:00.000Z"),
      person: 2,
    },
    {
      text: "Reschedule Sales Team Meeting",
      startDate: new Date("2021-02-23T23:15:00.000Z"),
      endDate: new Date("2021-02-24T01:00:00.000Z"),
      person: 2,
    },
    {
      text: "Send 2 Remotes for Giveaways",
      startDate: new Date("2021-02-24T16:30:00.000Z"),
      endDate: new Date("2021-02-24T18:45:00.000Z"),
      person: 1,
    },
    {
      text: "Discuss Product Giveaways with Management",
      startDate: new Date("2021-02-24T19:15:00.000Z"),
      endDate: new Date("2021-02-24T23:45:00.000Z"),
      person: 2,
    },
    {
      text: "Replace Desktops on the 3rd Floor",
      startDate: new Date("2021-02-25T16:30:00.000Z"),
      endDate: new Date("2021-02-25T17:45:00.000Z"),
      person: 1,
    },
    {
      text: "Update Database with New Leads",
      startDate: new Date("2021-02-25T19:00:00.000Z"),
      endDate: new Date("2021-02-25T21:15:00.000Z"),
      person: 2,
    },
    {
      text: "Mail New Leads for Follow Up",
      startDate: new Date("2021-02-25T21:45:00.000Z"),
      endDate: new Date("2021-02-25T22:30:00.000Z"),
      person: 2,
    },
    {
      text: "Send Territory Sales Breakdown",
      startDate: new Date("2021-02-26T01:00:00.000Z"),
      endDate: new Date("2021-02-26T03:00:00.000Z"),
      person: 1,
    },
    {
      text: "Territory Sales Breakdown Report",
      startDate: new Date("2021-02-26T15:45:00.000Z"),
      endDate: new Date("2021-02-26T16:45:00.000Z"),
      person: 1,
    },
    {
      text: "Report on the State of Engineering Dept",
      startDate: new Date("2021-02-26T21:45:00.000Z"),
      endDate: new Date("2021-02-26T22:30:00.000Z"),
      person: 2,
    },
    {
      text: "Staff Productivity Report",
      startDate: new Date("2021-02-26T23:15:00.000Z"),
      endDate: new Date("2021-02-27T02:30:00.000Z"),
      person: 2,
    },
  ];
  const resourcesData = [
    {
      text: "Holiday",
      id: 1,
      color: "#cb6bb2",
    },
    {
      text: "Work",
      id: 2,
      color: "#56ca85",
    },
  ];
  //   const personData = [
  //     {
  //       text: "Ivanov",
  //       id: 5,
  //       color: "#54c335ff",
  //     },
  //     {
  //       text: "Petrov",
  //       id: 7,
  //       color: "#ff9747",
  //     },
  //     {
  //       text: "Sidorov",
  //       id: 3,
  //       color: "#2d2db8ff",
  //     },
  //   ];
  let personData = staff?.map((el) => ({
    text: el.lastname,
    id: el.personid,
    // type: el.type,
  }));
  console.log(staff);
  const appointmentTemplate = (appointmentData) => {
    return (
      <div
        style={{
          backgroundColor: appointmentData.id === 1 ? "#ff0000" : "#00ff00",
          padding: "5px",
          borderRadius: "5px",
          color: "#fff",
        }}
      >
        {appointmentData.text}
      </div>
    );
  };
  const onAppointmentDeleted = (e) => {
    // Отключаем удаление записи
    e.cancel = true;
  };
  const currentDate = new Date(2021, 1, 2);
  const dayOfWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DateCell = ({ data: cellData }) => (
    <>
      {console.log(cellData)}
      <div className="name">{dayOfWeekNames[cellData.date.getDay()]}</div>
      <div className="number">{cellData.date.getDate()}</div>
    </>
  );

  const typesOfSchedule = [
    {
      id: 1,
      name: "holiday",
    },
    {
      id: 2,
      name: "work",
    },
  ];
  const types = { 1: "holiday", 2: "work" };
  useEffect(() => {
    (async () => {
      setScheduleData(await getSchedule());
    })();
  }, []);
  const [mode, setMode] = useState();
  const saveAddSchedule = async () => {
    console.log(sel.wd2);
    // Создаем новую дату
    let date = new Date(sel.wd2); // или укажите конкретную дату, например: new Date('2023-10-01')

    // Устанавливаем время на 23:59:00
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(0); // Можно также установить секунды, если нужно

    // Выводим обновленную дату и время
    console.log("Дата с установленным временем 23:59:", date);
    // console.log(new Date(sel.wd1).toISOString(), new Date(date).toISOString());
    // console.log(new Date(new Date(sel.wd2) + 60 * 60));
    if (mode === "add")
      await addSchedule({
        ...sel,
        wd1: moment(new Date(sel.wd1)).format("DD/MM/YYYY HH:mm:ss "),
        wd2: moment(new Date(date)).format("DD/MM/YYYY HH:mm:ss "),
      });
    else {
      await editSchedule({
        ...sel,
        wd1: moment(new Date(sel.wd1)).format("DD/MM/YYYY HH:mm:ss "),
        wd2: moment(new Date(date)).format("DD/MM/YYYY HH:mm:ss "),
      });
    }
    setScheduleData(await getScheduleById(shop));
    setShowCreateSchedule(false);
  };
  console.log(
    scheduleData?.map((el) => ({
      text: types[el.type],
      startDate: new Date(el.wd1),
      endDate: new Date(el.wd2),
      person: el.personid,
      type: el.type,
    }))
  );
  console.log(personData);
  //   let date = new Date(); // Текущая дата и время

  //   // Установите дату и время без смещения
  //   date.setUTCFullYear(2023);
  //   date.setUTCMonth(9); // Октябрь (месяцы начинаются с 0)
  //   date.setUTCDate(1);
  //   date.setUTCHours(12);
  //   date.setUTCMinutes(0);
  //   date.setUTCSeconds(0);

  //   console.log("Дата без смещения:", date.toISOString()); // Вывод в ISO формате
  const [schedule, setSchedule] = useState();
  const [shop, setShop] = useState();
  const [showPoints, setShowPoints] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showChangePoints, setShowChangePoints] = useState(false);
  const [showCreatePoints, setShowCreatePoints] = useState(false);
  useEffect(() => {
    if (shop)
      setSchedule(
        scheduleData?.map((el) => ({
          text: types[el.type],
          startDate: el.wd1,
          endDate: el.wd2,
          person: el.personid,
          type: el.type,
          id: el.id,
        }))
      );
  }, [scheduleData]);

  useEffect(() => {
    if (!shops?.length) return;
    console.log(shops);
    setShop(shops[0].id);
  }, [shops]);

  useEffect(() => {
    if (!shop) return;
    (async () => {
      setScheduleData(await getScheduleById(shop));
    })();
  }, [shop]);
  useEffect(() => {
    (async () => {
      setPointsData(await getPointsInfo());
    })();
  }, []);

  console.log(shop);
  console.log(sel);
  const [pointsInfo, setPointsInfo] = useState({ name: "", points: 0 });
  const [pointsData, setPointsData] = useState();
  const [selectedTask, setSelectedTask] = useState();
  const savePointsInfo = async () => {
    if (parseInt(pointsInfo.points) == pointsInfo.points) {
      await addToPointsInfo(pointsInfo);
      setPointsData(await getPointsInfo());
    } else alert('Введите целое число в графе "баллы"');
  };
  const saveEditTask = async () => {
    await editPointsInfo(selectedTask);
    setPointsData(await getPointsInfo());
  };
  console.warn(selectedTask);
  const [pointsStaff, setPointsStaff] = useState();
  const [showCreatePointsStaff, setShowCreatePointsStaff] = useState();
  const [selectedStaffPoints, setSelectedStaffPoints] = useState({});
  const [dataStaffPoints, setDataStaffPoints] = useState();
  console.log(selectedStaffPoints);
  const saveStaffPoints = () => {
    addStaffPoints({
      ...selectedStaffPoints,
      shift: moment(new Date(selectedStaffPoints.shift)).format("DD/MM/YYYY"),
    });
  };
  useEffect(() => {
    (async () => {
      // setDataStaffPoints(await getStaffPointsById(selected.personid));
    })();
  }, []);
  const [selectedPoints, setSelectedPoints] = useState();
  return (
    <>
      {!showSchedule && !showTasks && !showPoints && (
        <>
          <Popup
            onHiding={() => {
              setChangeStaffPopUp(false);
            }}
            visible={changeStaffPopUp}
            title={`Изменить сотрудника`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="500px"
          >
            {textbox_data.map((el) => (
              <div className="dx-field">
                <div className="dx-field-label">{el.dataCaption}</div>
                <div className="dx-field-value">
                  {el.type !== "date" && (
                    <TextBox
                      onValueChanged={(e) => {
                        console.log(e);
                        setSelected({ ...selected, [el.name1]: e.value });
                      }}
                      value={selected[el.name1]}
                    />
                  )}
                  {el.type === "date" && (
                    <DateBox
                      onValueChanged={(e) => {
                        console.log(e);
                        setSelected({ ...selected, [el.name1]: e.value });
                      }}
                      displayFormat="dd/MM/yyyy"
                      value={selected[el.name1]}
                    />
                  )}
                </div>
              </div>
            ))}
            <Button text="Сохранить" onClick={changeStaff_save} />
          </Popup>

          <Popup
            onHiding={() => {
              setAddStaffPopUp(false);
            }}
            visible={addStaffPopUp}
            title={`Новый сотрудник`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="500px"
          >
            {textbox_data.map((el) => (
              <div className="dx-field">
                <div className="dx-field-label">{el.dataCaption}</div>
                <div className="dx-field-value">
                  {el.type !== "date" && (
                    <TextBox
                      onValueChanged={(e) => {
                        console.log(e);
                        setUser({ ...user, [el.name1]: e.value });
                      }}
                      value={user[el.name1]}
                    />
                  )}
                  {el.type === "date" && (
                    <DateBox
                      onValueChanged={(e) => {
                        console.log(e);
                        setUser({ ...user, [el.name1]: e.value });
                      }}
                      displayFormat="dd/MM/yyyy"
                      value={user[el.name1]}
                    />
                  )}
                </div>
              </div>
            ))}
            <Button text="Сохранить" onClick={send_addstaff} />
          </Popup>

          <DataGrid
            onSelectionChanged={(e) => {
              console.log(e);
              console.log(e.selectedRowsData[0]);
              if (e.selectedRowsData[0]) setSelected(e.selectedRowsData[0]);
            }}
            dataSource={staff}
          >
            <Toolbar>
              <Item location="before">
                <Button text="Добавить сотрудника" onClick={addStaff} />
              </Item>

              <Item location="before">
                <Button text="Изменить сотрудника" onClick={changeStaff} />
              </Item>
              <Item location="before">
                <Button text="Удалить сотрудника" onClick={removeStaff} />
              </Item>
              <Item location="before">
                <Button
                  text="Расписание"
                  onClick={() => setShowSchedule(true)}
                />
              </Item>
              <Item location="before">
                <Button text="Задачи" onClick={() => setShowTasks(true)} />
              </Item>
              <Item location="before">
                <Button
                  text="Баллы"
                  onClick={async () => {
                    if (!selected.personid) {
                      alert("Выберите сотрудника!");
                      return;
                    }
                    setShowPoints(true);

                    setSelectedStaffPoints({ personid: selected.personid });
                    setDataStaffPoints(
                      await getStaffPointsById(selected.personid)
                    );
                  }}
                />
              </Item>
            </Toolbar>
            <Selection mode="single" />
            <Column dataField="lastname" caption="Фамилия" />
            <Column dataField="firstname" caption="Имя" />
            <Column dataField="middlename" caption="Отчество" />
            <Column
              dataField="datefrom"
              dataType="date"
              format="dd/MM/yyyy"
              caption="Дата"
            />
          </DataGrid>
        </>
      )}
      {showSchedule && shops && (
        <>
          <Button
            text="Вернуться"
            onClick={() => {
              setShowSchedule(false);
              setShop();
              setShops();
              setSchedule();
            }}
          />
          <br />
          <Button text="Создать" onClick={() => setShowCreateSchedule(true)} />
          <SelectBox
            placeholder="Выберите магазина"
            dataSource={shops}
            displayExpr="name"
            defaultValue={shops[0]?.id}
            searchEnabled={true}
            searchMode={"contains"}
            width={"400px"}
            onValueChanged={(e) => {
              setShop(e.value);
            }}
            showClearButton={true}
            // inputAttr={templatedProductLabel}
            valueExpr="id"
            // defaultValue={partners[0].uid}
          />
          <Popup
            onHiding={() => {
              setShowCreateSchedule(false);
            }}
            visible={showCreateSchedule}
            title={`Расписание`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="500px"
          >
            {/* <SelectBox
              onValueChanged={(e) => {
                console.log(e);
                setUser({ ...user, [el.name1]: e.value });
              }}
              value={user[el.name1]}
            /> */}
            <SelectBox
              placeholder="Выберите сотрудника"
              dataSource={staff.map((employee) => ({
                name:
                  employee.lastname +
                  " " +
                  employee.firstname +
                  " " +
                  employee.middlename,
                id: employee.personid,
              }))}
              displayExpr="name"
              value={sel.personid}
              searchEnabled={true}
              searchMode={"contains"}
              width={"400px"}
              onValueChanged={(e) => {
                setSel({ ...sel, personid: e.value });
              }}
              showClearButton={true}
              // inputAttr={templatedProductLabel}
              valueExpr="id"
              // defaultValue={partners[0].uid}
            />
            С какой даты:
            <DateBox
              width={400}
              onValueChanged={(e) => {
                console.log(e);
                setSel({ ...sel, wd1: e.value });
              }}
              displayFormat="dd/MM/yyyy"
              value={sel.wd1}
            />
            По какую дату:
            <DateBox
              width={400}
              onValueChanged={(e) => {
                console.log(e);
                setSel({ ...sel, wd2: e.value });
              }}
              displayFormat="dd/MM/yyyy"
              value={sel.wd2}
            />
            Тип:
            <SelectBox
              width={400}
              placeholder="Выберите тип"
              dataSource={typesOfSchedule}
              displayExpr="name"
              value={sel.type}
              searchEnabled={true}
              searchMode={"contains"}
              onValueChanged={(e) => {
                setSel({ ...sel, type: e.value });
              }}
              showClearButton={true}
              // inputAttr={templatedProductLabel}
              valueExpr="id"
              // defaultValue={partners[0].uid}
            />
            Магазин:
            <SelectBox
              placeholder="Выберите магазина"
              dataSource={shops}
              displayExpr="name"
              value={sel.shop}
              searchEnabled={true}
              searchMode={"contains"}
              width={"400px"}
              onValueChanged={(e) => {
                setSel({ ...sel, shop: e.value });
              }}
              showClearButton={true}
              // inputAttr={templatedProductLabel}
              valueExpr="id"
              // defaultValue={partners[0].uid}
            />
            <Button text="Сохранить" onClick={saveAddSchedule} />
          </Popup>
          <Scheduler
            // timeZone="Russia/Moscow"
            dataSource={schedule}
            onAppointmentFormOpening={async (e) => {
              e.cancel = true;
              // alert(e.appointmentData?.allDay);
              if (e.appointmentData?.allDay !== undefined) setMode("add");
              else setMode("edit");
              // setAllDAy(e.appointmentData?.allDAy);
              console.log(e.appointmentData);
              setShowCreateSchedule(true);
              setSel({
                id: e.appointmentData.id,
                wd1: e.appointmentData.startDate,
                wd2: e.appointmentData.endDate,
                personid: e.appointmentData.person,
                type: 2,
                shop: shop,
              });
              console.log(e);

              //  const data = e.appointmentData;
              //   await editSchedule({
              //     type: data.type,
              //     wd1: moment(data.startDate).format("DD/MM/YYYY HH:mm:ss "),
              //     wd2: moment(data.endDate).format("DD/MM/YYYY HH:mm:ss "),
              //     personId: data.person,
              //     id: data.id,
              //   });
              //   setSchedule(
              //     schedule.map((el) => {
              //       if (e.appointmentData.id !== el.id) return el;
              //       else {
              //         return {
              //           ...el,
              //           text: types[el.type],
              //         };
              //       }
              //     })
              //   );
            }}
            onSelectionChanged={(e) => console.log(e)}
            onAppointmentDeleted={async (e) => {
              await deleteSchedule(e.appointmentData.id);
              setScheduleData(await getScheduleById(shop));
            }}
            onAppointmentDblClick={(e) => {
              console.log(e);
              //   e.cancel(true);
            }}
            onAppointmentUpdating={(e) => {
              //   e.cancel(true);
            }}
            onAppointmentUpdated={async (e) => {
              console.log(e);
              const data = e.appointmentData;
              await editSchedule({
                type: data.type,
                wd1: moment(data.startDate).format("DD/MM/YYYY HH:mm:ss "),
                wd2: moment(data.endDate).format("DD/MM/YYYY HH:mm:ss "),
                personId: data.person,
                id: data.id,
              });
              setSchedule(
                schedule.map((el) => {
                  if (e.appointmentData.id !== el.id) return el;
                  else {
                    return {
                      ...el,
                      text: types[el.type],
                    };
                  }
                })
              );
            }}
            views={views}
            defaultCurrentView="timelineMonth"
            defaultCurrentDate={new Date()}
            height={580}
            groups={groups}
            cellDuration={60}
            firstDayOfWeek={0}
            startDayHour={8}
            endDayHour={20}
          >
            {/* <View
      type="workWeek"
      groups={groups}
      startDayHour={9}
      endDayHour={18}
      dateCellComponent={DateCell}
    /> */}
            {/* <Editing
              allowAdding={true}
              allowDeleting={true}
              allowUpdating={false}
            /> */}
            <Resource
              fieldExpr="type"
              // allowMultiple={true}
              dataSource={resourcesData}
              label="Type"
              useColorAsDefault={true}
            />
            <Resource
              fieldExpr="person"
              allowMultiple={false}
              dataSource={personData}
              label="Person"
            />
          </Scheduler>
        </>
      )}
      {showTasks && (
        <>
          <Popup
            onHiding={() => {
              setShowCreatePoints(false);
            }}
            visible={showCreatePoints}
            title={`Очки`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="500px"
          >
            Название:
            <TextBox
              onValueChanged={(e) => {
                console.log(e);
                setPointsInfo({ ...pointsInfo, name: e.value });
              }}
              value={pointsInfo.name}
            />
            Баллы:
            <TextBox
              onValueChanged={(e) => {
                console.log(e);
                setPointsInfo({ ...pointsInfo, points: e.value });
              }}
              value={pointsInfo.points}
            />
            <Button text="Сохрнаить" onClick={savePointsInfo} />
          </Popup>
          <Popup
            onHiding={() => {
              setShowChangePoints(false);
            }}
            visible={showChangePoints}
            title={`Очки`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="500px"
          >
            Название:
            <TextBox
              onValueChanged={(e) => {
                console.log(e);
                setSelectedTask({ ...selectedTask, name: e.value });
              }}
              value={selectedTask?.name}
            />
            Баллы:
            <TextBox
              onValueChanged={(e) => {
                console.log(e);
                setSelectedTask({ ...selectedTask, points: e.value });
              }}
              value={selectedTask?.points}
            />
            <Button text="Сохрнаить" onClick={saveEditTask} />
          </Popup>
          <DataGrid
            width={800}
            dataSource={pointsData}
            onSelectionChanged={(e) => {
              console.warn(">>>", e);
              setSelectedTask(e.currentSelectedRowKeys[0]);
            }}
          >
            <Column alignment="left" dataField="name" caption="Название" />
            <Column alignment="left" dataField="points" caption="Баллы" />
            <Toolbar>
              <Item location="before">
                <Button
                  text="Вернуться"
                  onClick={() => {
                    setShowTasks(false);
                  }}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Создать"
                  onClick={() => {
                    setShowCreatePoints(true);
                  }}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Изменить"
                  onClick={() => {
                    if (selectedTask) setShowChangePoints(true);
                  }}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Удалить"
                  onClick={async () => {
                    console.warn(selectedTask);
                    if (
                      selectedTask &&
                      window.confirm("Вы уверены что хотите удалить?")
                    ) {
                      await deletePoints(selectedTask.id);
                      setPointsData(await getPointsInfo());
                    }
                  }}
                />
              </Item>
            </Toolbar>
            <Selection mode="single" />{" "}
          </DataGrid>
        </>
      )}
      {showPoints && (
        <>
          <DataGrid
            onSelectionChanged={(e) => {
              console.warn(">>>", e);
              setSelectedPoints(e.currentSelectedRowKeys[0]);
            }}
            width={1000}
            dataSource={dataStaffPoints?.map((el) => ({
              person: staff.find((em) => em.personid === el.personid).lastname,
              event: pointsData.find((points) => points.id === el.pointsid)
                .name,
              shift: moment(new Date(el.shift)).format("DD/MM/YYYY"),
              points: el.points,
              id: el.id,
            }))}
          >
            <Toolbar>
              <Item location="before">
                <Button
                  text="Вернуться"
                  onClick={() => {
                    setShowPoints(false);
                  }}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Создать"
                  onClick={() => setShowCreatePointsStaff(true)}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Удалить"
                  onClick={async () => {
                    if (
                      selectedPoints &&
                      window.confirm("Вы уверены, что хотите удалить?")
                    ) {
                      await deleteStaffPoints(selectedPoints.id);
                      setDataStaffPoints(
                        await getStaffPointsById(selected.personid)
                      );
                    }
                  }}
                />
              </Item>
            </Toolbar>
            <Column dataField="id" visible={false} />
            <Column alignment="left" dataField="person" caption="Фамилия" />
            <Column alignment="left" dataField="event" caption="Событие" />
            <Column alignment="left" dataField="shift" caption="Дата" />
            <Column alignment="left" dataField="points" caption="Баллы" />
            <Selection mode="single" />
          </DataGrid>
          <Popup
            onHiding={() => {
              setShowCreatePointsStaff(false);
              console.log(selected);
              console.log(selectedStaffPoints);
              // console.log(pointsData);
            }}
            visible={showCreatePointsStaff}
            title={`Очки сотрудника`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="500px"
          >
            Сотрудник: {console.log(staff, selected)}
            {staff.find((el) => el.personid === selected.personid)?.lastname}
            <SelectBox
              placeholder="Выберите событие"
              dataSource={pointsData}
              displayExpr="name"
              // defaultValue={shops[0]?.id}
              searchEnabled={true}
              searchMode={"contains"}
              width={"400px"}
              onValueChanged={(e) => {
                setSelectedStaffPoints({
                  ...selectedStaffPoints,
                  event: e.value,
                  points: pointsData.find((points) => points.id === e.value)
                    ?.points,
                });
              }}
              showClearButton={true}
              // inputAttr={templatedProductLabel}
              valueExpr="id"
              // defaultValue={partners[0].uid}
            />
            Баллы:
            <TextBox
              width={400}
              onValueChanged={(e) => {
                console.log(e);
                setSelectedStaffPoints({
                  ...selectedStaffPoints,
                  points: e.value,
                });
              }}
              value={selectedStaffPoints?.points}
            />
            Дата:
            <DateBox
              width={400}
              onValueChanged={(e) => {
                console.log(e);
                setSelectedStaffPoints({
                  ...selectedStaffPoints,
                  shift: e.value,
                });
              }}
              displayFormat="dd/MM/yyyy"
              value={selectedStaffPoints.shift}
            />
            <Button text="Сохранить" onClick={saveStaffPoints} />
          </Popup>
        </>
      )}
    </>
  );
}
