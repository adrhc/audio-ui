export function isInsecureAdrhc() {
  return window.location.hostname == '192.168.1.31' || window.location.hostname == 'localhost';
}
