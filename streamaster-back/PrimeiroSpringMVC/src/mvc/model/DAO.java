package mvc.model;

import java.io.*;
import java.nio.file.Files;
import java.sql.*;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;

public class DAO {
	
	private Connection connection = null;
	
	public DAO() {
		try {
			Class.forName("com.mysql.jdbc.Driver");
				connection = DriverManager.getConnection(
							"jdbc:mysql://localhost/streamaster", "root", "root");
		} catch (SQLException | ClassNotFoundException e) {e.printStackTrace();}
	}
	
public void adiciona(Tarefa login) throws IOException {
	/*MultipartFile filePart = login.getImage();
		 Rotina para salvar o arquivo no servidor
		if (!filePart.isEmpty()) {
			String fileName = filePart.getOriginalFilename();
			File uploads = new File("/tmp");
				File file = new File(uploads, fileName);
				try (InputStream input = filePart.getInputStream()) {
					Files.copy(input, file.toPath());
				}
		}*/
		try {
			String sql = "INSERT INTO login (name, password, email, image) values(?,?,?,?)";
			PreparedStatement stmt = connection.prepareStatement(sql);
			stmt.setString(1,login.getName());
			stmt.setString(2,login.getPassword());
			stmt.setString(3,login.getEmail());
			stmt.setString(4,login.getImage());
			stmt.execute();
			stmt.close();
		} catch (SQLException e) {e.printStackTrace();}
}
	
	
	public boolean existeUsuario(Tarefa login) {
		boolean existe = false;
	try {
		PreparedStatement stmt = connection.
				prepareStatement("SELECT COUNT(*) FROM login WHERE name=? AND password=? LIMIT 1");
		stmt.setString(1, login.getName());
		stmt.setString(2, login.getPassword());
		ResultSet rs = stmt.executeQuery();
		if(rs.next()){
			if(rs.getInt(1) != 0) {existe=true;}
		}
		rs.close();
		stmt.close();
	} catch(SQLException e) {System.out.println(e);}
	return existe;
	}
	
	public byte[] buscaFoto(String name) {
		byte[] imgData = null;
		try {
			PreparedStatement stmt = connection.
			prepareStatement("SELECT * FROM login WHERE name=? ");
			stmt.setString(1, name);
			ResultSet rs = stmt.executeQuery();
			if(rs.next()) {
				Blob image = rs.getBlob("image");
				imgData = image.getBytes(1, (int) image.length());
			}
			rs.close();
			stmt.close();
		} catch(SQLException e) {System.out.println(e);}
		 return imgData;
		
	}
			
}
		
