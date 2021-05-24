export const getAllDBUsers = "/dbusers/all"
export const saveDBUser = "/dbusers/save"
export const getDBUser = "/dbusers/dbusers"
export const removeUser = "/dbusers/removeUser"
export const removeAllUsers = "/dbusers/removeall"
export const removeSelectedUsers = "/dbusers/removeselectedusers"

export function isNil(value: string) {
  return typeof value === 'undefined' || value === null;
}
