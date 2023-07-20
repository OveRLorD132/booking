export default function(socket) {
  if(socket.request.session.passport && socket.request.session.passport.user) return true;
  return false;
}