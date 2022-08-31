// Never use these field keys outside of this file and only
// expose functions for interacting with them.
const FIELDS = {
  JWT: 'JWT',
}

//======================================================
//=========================JWT==========================
//======================================================

export const setJWT = (jwtString) => {
  window.localStorage.setItem(FIELDS.JWT, jwtString)
}

export const clearJWT = () => {
  window.localStorage.removeItem(FIELDS.JWT)
}

export const getJWT = () => window.localStorage.getItem(FIELDS.JWT) ?? null
