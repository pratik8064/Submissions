package edu.asupoly.ser421;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.Socket;
import java.net.URL;
import java.util.StringTokenizer;

class ClientConnectionHandler implements Runnable {

	InputStream in = null;
	OutputStream out = null;
	long delayTime = 0;
	String targetHost = null;
	int targetPort = 0;

	public ClientConnectionHandler(Socket socket, long delayTime, String targetHost, int targetPort) {

		try {
			this.in = socket.getInputStream();
			this.out = socket.getOutputStream();
			this.delayTime = delayTime;
			this.targetHost = targetHost;
			this.targetPort = targetPort;
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	@Override
	public void run() {
		try {
			Thread.sleep(delayTime);
			this.out.write(createResponse(in));
		} catch (IOException ex) {
			ex.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			try {
				this.in.close();
				this.out.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}
	
	public byte[] createResponse(InputStream inStream) {
        byte[] responseText = null;
        BufferedReader inReq = null;
        try {
        	inReq = new BufferedReader(new InputStreamReader(inStream, "UTF-8"));
            String reqString = null;
            String getLine = inReq.readLine();
            if (getLine != null && !getLine.trim().equals("")) {
                StringTokenizer tokenList = new StringTokenizer(getLine);
                if (tokenList.nextToken().equals("GET") && tokenList.hasMoreTokens()) {
                	reqString = tokenList.nextToken();
                    if (reqString.startsWith("/")) {
                    	reqString = reqString.substring(1);
                    }
                }
            }
            if (reqString == null) {
            	responseText = "<html> Its not proper GET request</html>".getBytes();
            } else {
            	if (Server.map.get(reqString) == null) {
            		//System.out.println("not in cache");
            		responseText = getFileFromRemote(reqString);
            	} else {
            		//System.out.println("Found in the Cache!!");
            		responseText = Server.map.get(reqString);
				}
            }
        } catch (IOException e) {
            e.printStackTrace();
            responseText = ("<html>following error is occured: " + e.getMessage() + "</html").getBytes();
        }
        return responseText;
    }

	public byte[] getFileFromRemote(String fileName) {
//		System.out.println("new file " + fileName + " is requested");
		StringBuffer responseString = new StringBuffer();
		BufferedReader responseFile = null;
		URL urlObject = null;
		try {
			urlObject = new URL("http://" + this.targetHost + ":" + this.targetPort + "/" + fileName);
			//System.out.println("newly formed url is : " + urlObject);
			HttpURLConnection connection = (HttpURLConnection) urlObject.openConnection();
			connection.setRequestProperty("User-Agent", "Mozilla/5.0");
			int responseCode = 0;
			responseCode = connection.getResponseCode();
			//System.out.println(responseCode);
			if (responseCode == 200) {
				responseFile = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				String input;
				while ((input = responseFile.readLine()) != null) {
					responseString.append(input);
				}
				responseFile.close();
				Server.map.put(fileName, responseString.toString().getBytes());	
				
			}else if(responseCode == 302){
				responseString = new StringBuffer("<html> response code 302 --> Requested resouce is temporarily assigned different URL (Redirection)</html>");
			}else if(responseCode == 404){
				responseString = new StringBuffer("<html> response code 404 --> Resource does not exists recieved</html>");
			}else if(responseCode == 500){
				responseString = new StringBuffer("<html> response code 500 --> Internal server Error has occured</html>");
			}else {
				System.out.println(responseCode + " : responseCode");
				responseString = new StringBuffer("<html> Response is not received </html>");
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return responseString.toString().getBytes();
	}

}