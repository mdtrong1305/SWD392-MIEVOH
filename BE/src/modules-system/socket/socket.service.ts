import { Injectable, Logger } from '@nestjs/common';
import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  
  private readonly logger = new Logger(SocketService.name);

  handleConnection(client: Socket) {
    this.logger.log(`Socket Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket Client disconnected: ${client.id}`);
  }

  // Lắng nghe sự kiện Frontend xin gia nhập phòng cá nhân
  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    const roomName = `ROOM_${userId}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} joined room: ${roomName}`);
    return { event: 'joined', data: `Successfully joined room ${roomName}` };
  }

  // Lắng nghe sự kiện Frontend rời phòng cá nhân (khi đăng xuất)
  @SubscribeMessage('leave_room')
  handleLeaveRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    const roomName = `ROOM_${userId}`;
    client.leave(roomName);
    this.logger.log(`Client ${client.id} left room: ${roomName}`);
  }


  // 1. Emit báo cáo tiến độ phân tích dữ liệu AI về cho Frontend (Chuẩn Room)
  emitAnalysisProgress(userId: string, progress: number) {
    this.server.to(`ROOM_${userId}`).emit('analysis_progress', { progress });
  }

  // 2. Thêm sự kiện bắn Thông báo (Notification) Realtime tới đích danh USER (Chuẩn Room)
  emitNotification(userId: string, payload: any) {
    // Chỉ những Socket Client nào đã .join(`ROOM_${userId}`) mới nhận được sự kiện này
    this.server.to(`ROOM_${userId}`).emit('notification', payload);
  }

  // 3. Thêm sự kiện Broadcast thông báo toàn hệ thống (Bảo trì, Event hot...)
  emitBroadcastNotification(payload: any) {
    this.server.emit('broadcast_notification', payload);
  }
}
