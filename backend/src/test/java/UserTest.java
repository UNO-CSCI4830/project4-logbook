import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import com.example.demo.model.User;

public class UserTest {
    @Test
    public void testPassword() {
        User user = new User();
        user.setPassword("password123");
        assertEquals("password123", user.getPassword());
    }

    @Test
    public void testName() {
        User user = new User();
        user.setName("Manman");
        assertEquals("Manman", user.getName());
    }

    @Test
    public void testId() {
        User user = new User();
        user.setId(3141L);
        assertEquals(3141L, user.getId());
    }

    @Test
    public void testEmail() {
        User user = new User();
        user.setEmail("man@manman.com");
        assertEquals("man@manman.com", user.getEmail());
    }


}
