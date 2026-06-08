import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService {
  @WebSocketServer()
  server!: Server;

  // emit báo cáo tiến độ phân tích dữ liệu AI về cho Frontend
  emitAnalysisProgress(progress: number) {
    this.server.emit('analysis_progress', { progress });
  }

  // thêm các emit sau này tại đây..
  // ex: emitNotification() { ... }
}
