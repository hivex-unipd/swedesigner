package server.utility;

import java.io.*; 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.io.ObjectOutputStream;
import java.io.ObjectInputStream;


public class Compressor {
	public void zip(String path) throws IOException{
		/*parte zip*/
		byte[] buffer = new byte[1024];
		FileOutputStream fos = new FileOutputStream(path);
		ZipOutputStream zos = new ZipOutputStream(fos);
		File folder = new File(path); 
		File[] files = folder.listFiles();		
		for(File file : files){
			  if(file.isFile()){
				  ZipEntry ze= new ZipEntry(file.getName());
				  zos.putNextEntry(ze);
		            FileInputStream in = new FileInputStream(file);

		    		int len;
		    		while ((len = in.read(buffer)) > 0) {
		    			zos.write(buffer, 0, len);
		    		}
		    		
		    		in.close();
		    		zos.closeEntry();
			  }
		 }
		zos.close();//importante chiudere!!!
	}
}
