package edu.asupoly.ser421;

import java.io.*;
import java.net.*;
import java.util.*;

public class Lab1Part2 {
	public static void main(String[] args) {
		if (args.length != 5) {
			System.out.println("invalid arguments");
			System.exit(1);
		}
		int listenPort = Integer.parseInt(args[0]);
		String targetHost = args[1];
		int targetPort = Integer.parseInt(args[2]);
		long cacheSize = Long.parseLong(args[3]);
		long delay = Long.parseLong(args[4]);
		Server server = new Server(listenPort, targetHost, targetPort, cacheSize, delay);
		server.listen();
	}
}



