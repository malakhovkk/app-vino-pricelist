import Drawer from "devextreme-react/drawer";
import ScrollView from "devextreme-react/scroll-view";
import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { Header, SideNavigationMenu, Footer } from "../../components";
import "./side-nav-outer-toolbar.scss";
import { useScreenSize } from "../../utils/media-query";
import { Template } from "devextreme-react/core/template";
import { useMenuPatch } from "../../utils/patches";

export default function SideNavOuterToolbar({ title, children }) {
  const scrollViewRef = useRef(null);
  const navigate = useNavigate();
  const { isXSmall, isLarge } = useScreenSize();
  const [patchCssClass, onMenuReady] = useMenuPatch();
  const [menuStatus, setMenuStatus] = useState(
    isLarge ? MenuStatus.Opened : MenuStatus.Closed
  );

  const toggleMenu = useCallback(({ event }) => {
    setMenuStatus((prev) =>
      prev === MenuStatus.Closed ? MenuStatus.Opened : MenuStatus.Closed
    );
    event.stopPropagation();
  }, []);

  const temporaryOpenMenu = useCallback(() => {
    setMenuStatus((prev) =>
      prev === MenuStatus.Closed ? MenuStatus.TemporaryOpened : prev
    );
  }, []);

  const onOutsideClick = useCallback(() => {
    setMenuStatus((prev) =>
      prev !== MenuStatus.Closed && !isLarge ? MenuStatus.Closed : prev
    );
    return menuStatus === MenuStatus.Closed ? true : false;
  }, [isLarge, menuStatus]);

  const onNavigationChanged = useCallback(
    ({ itemData, event, node }) => {
      if (menuStatus === MenuStatus.Closed || !itemData.path || node.selected) {
        event.preventDefault();
        return;
      }

      navigate(itemData.path);

      // ✅ Новый способ — через getInstance() и scrollTo() API
      const scrollViewInstance =
        scrollViewRef.current?.instance || scrollViewRef.current;
      if (scrollViewInstance?.scrollTo) {
        scrollViewInstance.scrollTo(0); // новое API
      } else if (scrollViewInstance?.scrollToElement) {
        scrollViewInstance.scrollToElement(scrollViewRef.current);
      }

      if (!isLarge || menuStatus === MenuStatus.TemporaryOpened) {
        setMenuStatus(MenuStatus.Closed);
        event.stopPropagation();
      }
    },
    [navigate, menuStatus, isLarge]
  );

  return (
    <div className={"side-nav-outer-toolbar"}>
      <Header menuToggleEnabled toggleMenu={toggleMenu} title={title} />
      <Drawer
        className={["drawer", patchCssClass].join(" ")}
        position={"before"}
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={isLarge ? "shrink" : "overlap"}
        revealMode={isXSmall ? "slide" : "expand"}
        minSize={isXSmall ? 0 : 60}
        maxSize={250}
        shading={!isLarge}
        opened={menuStatus !== MenuStatus.Closed}
        template={"menu"}
      >
        <div className={"container"}>
          <ScrollView
            ref={scrollViewRef}
            className={"layout-body with-footer"}
            useNative={true} // ✅ важно для новых версий
          >
            <div className="content">
              {React.Children.map(children, (item) => {
                if (!React.isValidElement(item)) {
                  return item; // строки, null, undefined и т.д.
                }

                return item.type !== Footer ? item : null;
              })}
            </div>
            <div className="content">
              {React.Children.map(children, (item) => {
                if (!React.isValidElement(item)) {
                  return item; // строки, null, undefined и т.д.
                }

                return item.type === Footer ? item : null;
              })}
            </div>
          </ScrollView>
        </div>

        <Template name={"menu"}>
          <SideNavigationMenu
            compactMode={menuStatus === MenuStatus.Closed}
            selectedItemChanged={onNavigationChanged}
            openMenu={temporaryOpenMenu}
            onMenuReady={onMenuReady}
          />
        </Template>
      </Drawer>
    </div>
  );
}

const MenuStatus = {
  Closed: 1,
  Opened: 2,
  TemporaryOpened: 3,
};
