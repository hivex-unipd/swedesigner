package server.utility;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class Compressor {
	public void zip(String IdReq) throws Exception{
		/*parte zip*/
		byte[] buffer = new byte[1024];
		FileOutputStream fos = new FileOutputStream("src/main/resources/ContentFile/prova.zip");
		/*In Java, FileOutputStream is a bytes 
		stream class that’s used to handle raw binary data. To write the data to file, you have to convert the data into 
		bytes and save it to file*//*crea lo zip vuoto*/
		ZipOutputStream zos = new ZipOutputStream(fos);
		/*This class implements an output stream filter for writing files in the ZIP file format*/
		ZipEntry ze= new ZipEntry("px");
		/*This class is used to represent a ZIP file entry*//*da il nome al file dentrolo zip*/
		zos.putNextEntry(ze);/*This class is used to represent a ZIP file entry.*/
		FileInputStream in = new FileInputStream("src/main/resources/prova.json");
		/*A FileInputStream obtains input bytes from a file in a file system*/
		
		int len;
		while ((len = in.read(buffer)) > 0) {//	read(byte[] b) Reads up to b.length bytes of data from this input stream into an array of bytes.
			zos.write(buffer, 0, len);/*write(byte[] b, int off, int len)*/
		}
		
		in.close();
		zos.closeEntry();
		zos.close();//importante chiudere!!!
	};
}
