const INIT_KEY = "__CR_GSI_INITIALIZED__";
const HANDLER_KEY = "__CR_GSI_CREDENTIAL_HANDLER__";

function getWindow() {
  if (typeof window === "undefined") return null;
  return window;
}

export function setGsiCredentialHandler(handler) {
  const w = getWindow();
  if (!w) return;
  w[HANDLER_KEY] = handler;
}

export function ensureGsiInitialized(clientId) {
  const w = getWindow();
  if (!w) return false;
  if (!clientId) return false;
  if (!w.google?.accounts?.id) return false;

  if (w[INIT_KEY]) return true;

  w.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      const handler = w[HANDLER_KEY];
      if (typeof handler === "function") handler(response);
    },
  });

  w[INIT_KEY] = true;
  return true;
}
