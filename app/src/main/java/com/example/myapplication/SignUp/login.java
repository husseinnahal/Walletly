package com.example.myapplication.SignUp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
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

public class login extends AppCompatActivity {

    EditText emailInput, passwordInput;
    Button loginButton;
     TextView tosingin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);


        tosingin = findViewById(R.id.tosignup);


        tosingin.setOnClickListener(v -> {
            Intent intent = new Intent(login.this, singup.class);
            startActivity(intent);
        });

        emailInput = findViewById(R.id.email);
        passwordInput = findViewById(R.id.password);
        loginButton = findViewById(R.id.signup);

        loginButton.setOnClickListener(v -> new Thread(this::loginUser).start());
    }

    private void loginUser() {
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            runOnUiThread(() -> Toast.makeText(login.this, "Fill all fields", Toast.LENGTH_SHORT).show());
            return;
        }

        Connection connection = DatabaseConnection.getConnection();
        if (connection != null) {
            try {
                String sql = "SELECT id FROM users WHERE email = ? AND password = ?";
                PreparedStatement statement = connection.prepareStatement(sql);
                statement.setString(1, email);
                statement.setString(2, password);
                ResultSet resultSet = statement.executeQuery();

                if (resultSet.next()) {
                    int userId = resultSet.getInt("id");


                    saveUserId(userId);

                    runOnUiThread(() -> {
                        Toast.makeText(login.this, "Login Successful!", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(login.this, Home.class);
                        startActivity(intent);
                        finish();
                    });
                } else {
                    runOnUiThread(() -> Toast.makeText(login.this, "Invalid email or password", Toast.LENGTH_SHORT).show());
                }

                resultSet.close();
                statement.close();
                connection.close();
            } catch (SQLException e) {
                Log.e("LoginError", "SQL Exception: " + e.getMessage(), e);
                runOnUiThread(() -> Toast.makeText(login.this, "Database error", Toast.LENGTH_SHORT).show());
            }
        } else {
            runOnUiThread(() -> Toast.makeText(login.this, "Database connection failed", Toast.LENGTH_SHORT).show());
        }
    }

    private void saveUserId(int userId) {
        SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt("userId", userId);
        editor.apply();
    }
}
