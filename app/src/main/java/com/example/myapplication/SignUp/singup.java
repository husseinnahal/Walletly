package com.example.myapplication.SignUp;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.Home;
import com.example.myapplication.R;
import com.example.myapplication.database.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class singup extends AppCompatActivity {

    EditText nameInput, emailInput, passwordInput;
    Button signupButton;
    TextView tologin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup);

        tologin = findViewById(R.id.tologin);

        tologin.setOnClickListener(v -> {
            Intent intent = new Intent(singup.this, login.class);
            startActivity(intent);
        });

        nameInput = findViewById(R.id.titletrainput);
        emailInput = findViewById(R.id.email);
        passwordInput = findViewById(R.id.password);
        signupButton = findViewById(R.id.signup);

        signupButton.setOnClickListener(v -> new Thread(this::registerUser).start());
    }

    private void registerUser() {
        String name = nameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            runOnUiThread(() -> Toast.makeText(singup.this, "Fill all fields", Toast.LENGTH_SHORT).show());
            return;
        } else if (name.length() < 3) {
            runOnUiThread(() -> Toast.makeText(singup.this, "Name must be at least 3 characters", Toast.LENGTH_SHORT).show());
            return;
        } else if (password.length() < 6) {
            runOnUiThread(() -> Toast.makeText(singup.this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show());
            return;
        }

        Connection connection = DatabaseConnection.getConnection();
        if (connection != null) {
            try {
                String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
                PreparedStatement statement = connection.prepareStatement(sql);
                statement.setString(1, name);
                statement.setString(2, email);
                statement.setString(3, password);
                int rowsInserted = statement.executeUpdate();

                if (rowsInserted > 0) {
                    // Retrieve the user ID (assuming the table has an auto-increment primary key)
                    String selectSql = "SELECT id FROM users WHERE email = ? AND password = ?";
                    PreparedStatement selectStatement = connection.prepareStatement(selectSql);
                    selectStatement.setString(1, email);
                    selectStatement.setString(2, password);
                    ResultSet resultSet = selectStatement.executeQuery();

                    if (resultSet.next()) {
                        int userId = resultSet.getInt("id");

                        // Save the userId to SharedPreferences
                        SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE);
                        SharedPreferences.Editor editor = sharedPreferences.edit();
                        editor.putInt("userId", userId);
                        editor.apply();

                        runOnUiThread(() -> {
                            Toast.makeText(singup.this, "Registration Successful!", Toast.LENGTH_SHORT).show();
                            startActivity(new Intent(singup.this, Home.class));
                            finish();
                        });
                    }

                    resultSet.close();
                    selectStatement.close();
                }

                statement.close();
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
                runOnUiThread(() -> Toast.makeText(singup.this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show());
            }
        } else {
            runOnUiThread(() -> Toast.makeText(singup.this, "Database connection failed", Toast.LENGTH_SHORT).show());
        }
    }
}
