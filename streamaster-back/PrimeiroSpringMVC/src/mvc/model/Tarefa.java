package mvc.model;
import org.springframework.web.multipart.MultipartFile;

public class Tarefa {
	private Integer id;
	private String name;
	private String password;
	private String email;
	private MultipartFile image;
	
	public Integer getId() {return id;}
	public void setId(Integer id) {this.id = id;}
	
	public String getName() {return name;}
	public void setName(String name) {this.name = name;}
	
	public String getPassword() {return password;}
	public void setPassword (String password) {this.password = password;}
	
	public String getEmail() {return email;}
	public void setEmail(String email) {this.email = email;}
	
	public MultipartFile getImage() {return image;}
	public void setImage(MultipartFile image) {this.image = image;}

}
