package edu.asupoly.ser421;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

class Server {
	
	ServerSocket serverSocket = null;
	Socket socket = null;
	long delayTime = 0;
	String targetHost = null;
	int targetPort;
	long cacheSize = 0;
	
	static Map<String, byte []> map = new HashMap<String, byte []>();
	
	Server(int port, String targetHost, int targetPort, long cacheSize, long delayTime) {
		
		this.delayTime = delayTime;
		this.targetHost = targetHost;
		this.targetPort = targetPort;
		this.cacheSize = cacheSize;
		
		try {
			this.serverSocket = new ServerSocket(port);
		} catch (IOException ioException) {
			ioException.printStackTrace();
		}
	}

	public void listen() {
		while (this.serverSocket.isBound() && !this.serverSocket.isClosed()) {
			System.out.println("server is ready ro take request");
			try {
				this.socket = this.serverSocket.accept();
				Thread t = new Thread(new ClientConnectionHandler(this.socket, this.delayTime, this.targetHost, this.targetPort));
				t.start();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}
	
}