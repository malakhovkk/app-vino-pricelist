import React, { useEffect, useRef, useCallback, useMemo } from "react";
import TreeView from "devextreme-react/tree-view";
import { navigation } from "../../app-navigation";
import { useNavigation } from "../../contexts/navigation";
import { useScreenSize } from "../../utils/media-query";
import "./SideNavigationMenu.scss";

import * as events from "devextreme/events";

export default function SideNavigationMenu(props) {
  const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } =
    props;

  const { isLarge } = useScreenSize();

  // формируем элементы меню
  const items = useMemo(() => {
    return navigation.map((item) => ({
      ...item,
      expanded: isLarge,
      path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
    }));
  }, [isLarge]);

  const {
    navigationData: { currentPath },
  } = useNavigation();

  const treeViewRef = useRef(null);
  const wrapperRef = useRef();

  // обработчик кликов по обертке
  const getWrapperRef = useCallback(
    (element) => {
      const prev = wrapperRef.current;
      if (prev) {
        events.off(prev, "dxclick");
      }

      wrapperRef.current = element;
      if (element) {
        events.on(element, "dxclick", (e) => {
          openMenu(e);
        });
      }
    },
    [openMenu]
  );

  useEffect(() => {
    const treeView = treeViewRef.current;
    if (!treeView) return;

    // Получаем instance через компонент React
    const tvInstance = treeView.instance;

    if (!tvInstance) {
      console.warn("TreeView instance not available");
      return;
    }

    // Используем безопасный подход
    if (currentPath) {
      try {
        // Пробуем разные методы выделения
        if (typeof tvInstance.selectItem === "function") {
          tvInstance.selectItem(currentPath);
        } else if (typeof tvInstance.selectItemByKey === "function") {
          tvInstance.selectItemByKey(currentPath);
        }

        // Пробуем раскрыть элемент
        if (typeof tvInstance.expandItem === "function") {
          tvInstance.expandItem(currentPath);
        }
      } catch (e) {
        console.warn("TreeView path selection error:", e);
      }
    }

    if (compactMode) {
      // Безопасное сворачивание
      if (typeof tvInstance.collapseAll === "function") {
        tvInstance.collapseAll();
      } else {
        console.warn("collapseAll method not available");
        // Альтернатива: управляем через данные
        const updatedItems = items.map((item) => ({
          ...item,
          expanded: false,
        }));
        // Если TreeView поддерживает обновление данных
        if (typeof tvInstance.option === "function") {
          tvInstance.option("items", updatedItems);
        }
      }
    }
  }, [currentPath, compactMode, items]);

  return (
    <div
      className="dx-swatch-additional side-navigation-menu"
      ref={getWrapperRef}
    >
      {children}
      <div className="menu-container">
        <TreeView
          ref={treeViewRef}
          items={items} // Используем props вместо dataSource для лучшей совместимости
          dataStructure="tree"
          keyExpr="path"
          displayExpr="text"
          selectionMode="single"
          focusStateEnabled={false}
          expandEvent="click"
          selectByClick={true}
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width="100%"
        />
      </div>
    </div>
  );
}
