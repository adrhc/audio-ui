export function isAdrhc(includePi?: boolean) {
  return (
    (includePi || window.location.port !== '82') &&
    (isLocalAdrhc(includePi) || window.location.hostname == 'adrhc.go.ro')
  );
}

function isLocalAdrhc(includePi?: boolean) {
  // console.log(`[isLocalAdrhc] hostname = ${window.location.hostname}, port = ${window.location.port}`);
  return (
    window.location.hostname == 'localhost' ||
    window.location.hostname == '127.0.0.1' ||
    window.location.hostname == '192.168.0.1' ||
    window.location.hostname == '192.168.1.31' ||
    (includePi && window.location.hostname == '192.168.0.32') ||
    (includePi && window.location.hostname == '192.168.1.32')
  );
}
