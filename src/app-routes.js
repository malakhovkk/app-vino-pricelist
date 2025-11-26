import {
  HomePage,
  TasksPage,
  ProfilePage,
  PricelistPage,
  DealsPage,
  InvoicePage,
  RevenuePage,
  StatisticsPage,
  StrPage,
  Revenue2Page,
  AbcPage,
  OrdersPage,
  ChatGptPage,
  VCardPage,
  StaffPage,
  MarksPage,
  MqttPage,
  Deals2Page,
  CardPage,
} from "./pages";

import { withNavigationWatcher } from "./contexts/navigation";

const routes = [
  {
    path: "/users",
    element: TasksPage,
  },
  {
    path: "/vendors",
    element: ProfilePage,
  },
  {
    path: "/pricelist",
    element: PricelistPage,
  },
  {
    path: "/deals",
    element: DealsPage,
  },
  {
    path: "/marks",
    element: MarksPage,
  },
  // {
  //   path: "/home",
  //   element: HomePage,
  // },
  // {
  //   path: "/1c",
  //   element: Cpage,
  // },
  {
    path: "/invoice",
    element: InvoicePage,
  },
  {
    path: "/revenue",
    element: RevenuePage,
  },
  {
    path: "/statistics",
    element: StatisticsPage,
  },
  {
    path: "/str",
    element: StrPage,
  },
  {
    path: "/revenue2",
    element: Revenue2Page,
  },
  {
    path: "/abc",
    element: AbcPage,
  },
  {
    path: "/orders",
    element: OrdersPage,
  },
  {
    path: "/chat-gpt",
    element: ChatGptPage,
  },
  {
    path: "/vcard",
    element: VCardPage,
  },
  {
    path: "/staff",
    element: StaffPage,
  },
  {
    path: "/mqtt",
    element: MqttPage,
  },
  {
    path: "/deals2",
    element: Deals2Page,
  },
  {
    path: "/card",
    element: CardPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
