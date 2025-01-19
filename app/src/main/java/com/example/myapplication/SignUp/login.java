package com.example.myapplication.SignUp;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.Home;
import com.example.myapplication.R;
import com.example.myapplication.database.DatabaseHelper;

public class login extends AppCompatActivity {

    private DatabaseHelper databaseHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (isUserLoggedIn()) {
            navigateToHome();
            return;
        }

        EdgeToEdge.enable(this);
        setContentView(R.layout.login);


        TextView toSignup = findViewById(R.id.tosignup);
        toSignup.setOnClickListener(v -> {
            Intent intent = new Intent(login.this, singup.class);
            startActivity(intent);
        });

        databaseHelper = new DatabaseHelper(this);

        EditText emailEditText = findViewById(R.id.email);
        EditText passwordEditText = findViewById(R.id.password);
        Button loginButton = findViewById(R.id.signup);

        loginButton.setOnClickListener(v -> {
            String email = emailEditText.getText().toString().trim();
            String password = passwordEditText.getText().toString().trim();

            // Validate inputs
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(login.this, "Please fill all the fields", Toast.LENGTH_LONG).show();
                return;
            }

            SQLiteDatabase db = databaseHelper.getReadableDatabase();
            Cursor cursor = db.rawQuery("SELECT id, email, password FROM Users WHERE email = ?", new String[]{email});

            if (cursor != null && cursor.moveToFirst()) {
                @SuppressLint("Range") String dbPassword = cursor.getString(cursor.getColumnIndex("password"));
                @SuppressLint("Range") int userId = cursor.getInt(cursor.getColumnIndex("id"));

                if (password.equals(dbPassword)) {
                    saveLoginState(userId);
                    navigateToHome();
                } else {
                    Toast.makeText(login.this, "Invalid password", Toast.LENGTH_LONG).show();
                }
                cursor.close();
            } else {
                Toast.makeText(login.this, "User not found", Toast.LENGTH_LONG).show();
            }
        });
    }

    private void saveLoginState(int userId) {
        getSharedPreferences("UserPrefs", MODE_PRIVATE)
                .edit()
                .putInt("userId", userId)
                .putBoolean("isLoggedIn", true)
                .apply();
    }

    private boolean isUserLoggedIn() {
        return getSharedPreferences("UserPrefs", MODE_PRIVATE).getBoolean("isLoggedIn", false);
    }

    private void navigateToHome() {
        Intent intent = new Intent(this, Home.class);
        startActivity(intent);
        finish();
    }
}
