import socketAuthCheck from "../middlewares/socket-auth-check.js";

import Notifications from "../db/redis/Notifications.js";

import Complains from "../db/postgres/Complains.js";

let complains = new Complains();

export default function (socket, io) {
  socket.on("notifications-load-request", async () => {
    if (!socketAuthCheck(socket)) return;
    io.to(`User_${socket.request.session.passport.user}`).emit(
      "notifications-load-result",
      await Notifications.prototype.getNotifications(
        socket.request.session.passport.user
      )
    );
  });
  socket.on("complaint-accept", async (complaint) => {
    if (!socketAuthCheck(socket)) return;
    await complains.acceptComplain(complaint.id);
    io.to(`User_${complaint.user_id}`).emit(
      "new-notification",
      await Notifications.prototype.getNotification(
        complaint.user_id,
        await Notifications.prototype.addNotification(
          complaint.user_id,
          "Complaint",
          "Your complaint have been accepted. Thanks for your report.",
          "complaint-accepted"
        )
      )
    );
    io.to(`User_${complaint.rent_user_id}`).emit(
      "new-notification",
      await Notifications.prototype.getNotification(
        complaint.rent_user_id,
        await Notifications.prototype.addNotification(
          complaint.rent_user_id,
          "Complaint",
          complaint.additionalText,
          "complaint-receive"
        )
      )
    );
    socket.emit("complaint-accepted", complaint.id);
  });
}
