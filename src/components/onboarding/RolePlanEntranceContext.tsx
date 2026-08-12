import React, { createContext, useContext } from 'react';

export interface RolePlanEntranceState {
    showPreviewBg: boolean;
    showRegularItems: boolean;
    showAccentItem: boolean;
}

const defaultState: RolePlanEntranceState = {
    showPreviewBg: true,
    showRegularItems: true,
    showAccentItem: true
};

export const RolePlanEntranceContext = createContext<RolePlanEntranceState>(defaultState);

export const useRolePlanEntrance = () => useContext(RolePlanEntranceContext);

export const RolePlanEntranceProvider: React.FC<{
    value: RolePlanEntranceState;
    children: React.ReactNode;
}> = ({ value, children }) => (
    <RolePlanEntranceContext.Provider value={value}>{children}</RolePlanEntranceContext.Provider>
);
