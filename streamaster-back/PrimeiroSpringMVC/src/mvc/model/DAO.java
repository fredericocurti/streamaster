package mvc.model;

import java.io.*;
import java.nio.file.Files;
import java.sql.*;
import java.util.*;

import org.json.JSONObject;
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
	
public JSONObject adiciona(User user) throws IOException {
	JSONObject res = new JSONObject();
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
	if (!this.existeUsuario(user)){
		try {
			String sql = "INSERT INTO login (name, password, email, image) values(?,?,?,?)";
			PreparedStatement stmt = connection.prepareStatement(sql);
			stmt.setString(1,user.getName());
			stmt.setString(2,user.getPassword());
			stmt.setString(3,user.getEmail());
			stmt.setString(4,user.getImage());
			stmt.execute();
			stmt.close();
			res = this.login(user.getEmail(),user.getPassword());
		} catch (SQLException e) {
			e.printStackTrace();
			res.put("status", 409);
		}
	} else {
		res.put("status",409);
	}
	return res;
}
		
	
	public boolean existeUsuario(User user) {
		boolean existe = false;
		try {
			PreparedStatement stmt = connection.
					prepareStatement("SELECT COUNT(*) FROM login WHERE name=? AND password=? LIMIT 1");
			stmt.setString(1, user.getName());
			stmt.setString(2, user.getPassword());
			ResultSet rs = stmt.executeQuery();
			if(rs.next()){
				if(rs.getInt(1) != 0) {
					existe = true;
				}
			}
			rs.close();
			stmt.close();
		} catch(SQLException e) {
			System.out.println(e);
		}
		return existe;	
	}
	
	public JSONObject login(String email, String password) {
		String imgData = null;
		String userName = null;
		Integer status = null;
		JSONObject res = new JSONObject();
		
		try {
			PreparedStatement stmt = connection.
			prepareStatement("SELECT * FROM login WHERE email=? AND password=?");
			stmt.setString(1, email);
			stmt.setString(2, password);
			ResultSet rs = stmt.executeQuery();
			
			
			if(rs.next()) {
				imgData = rs.getString("image");
				userName = rs.getString("name");
				status = 200;		
				res.put("status",status);
				res.put("image", imgData);
				res.put("userName", userName);
				res.put("email", email);
			} else {
				res.put("status", 401);
			}
			rs.close();
			stmt.close();
		} catch(SQLException e) {
			System.out.println(e);
		}
		 return res;
	}
			
}
		
