export function isAdrhc(includePi?: boolean) {
  return isLocalAdrhc(includePi) || window.location.hostname == 'adrhc.go.ro';
}

export function isLocalAdrhc(includePi?: boolean) {
  // console.log(`[isLocalAdrhc] window.location.hostname = ${window.location.hostname}`)
  return (
    window.location.hostname == 'localhost' ||
    window.location.hostname == '127.0.0.1' ||
    window.location.hostname == '192.168.0.1' ||
    window.location.hostname == '192.168.1.31' ||
    (includePi && window.location.hostname == '192.168.0.32') ||
    (includePi && window.location.hostname == '192.168.1.32')
  );
}
