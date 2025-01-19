package com.example.myapplication.SignUp;

import android.annotation.SuppressLint;
import android.content.ContentValues;
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
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.myapplication.Home;
import com.example.myapplication.R;
import com.example.myapplication.database.DatabaseHelper;

public class singup extends AppCompatActivity {

    private DatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        if (isUserLoggedIn()) {
            navigateToProfile();
            return;
        }

        EdgeToEdge.enable(this);
        setContentView(R.layout.signup);


        dbHelper = new DatabaseHelper(this);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });


        TextView toLogin = findViewById(R.id.tologin);
        toLogin.setOnClickListener(v -> {
            Intent intent = new Intent(singup.this, login.class);
            startActivity(intent);
        });


        @SuppressLint({"MissingInflatedId", "LocalSuppress"}) Button btnSignUp = findViewById(R.id.signup);
        btnSignUp.setOnClickListener(v -> {

            EditText etName = findViewById(R.id.name);
            EditText etEmail = findViewById(R.id.email);
            EditText etPassword = findViewById(R.id.password);

            String name = etName.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (!validateInput(name, email, password)) return;


            if (isEmailRegistered(email)) {
                Toast.makeText(singup.this, "Email already registered", Toast.LENGTH_SHORT).show();
                return;
            }


            long userId = insertUser(name, email, password);
            if (userId != -1) {
                saveLoginState((int) userId);
                navigateToProfile();
            } else {
                Toast.makeText(singup.this, "Error signing up", Toast.LENGTH_SHORT).show();
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

    private void navigateToProfile() {
        Intent intent = new Intent(this, Home.class);
        startActivity(intent);
        finish();
    }

    private boolean validateInput(String name, String email, String password) {
        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(singup.this, "Please fill all fields", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (name.length() < 3) {
            Toast.makeText(singup.this, "Name must be at least 3 characters", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(singup.this, "Invalid email format", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (password.length() < 6) {
            Toast.makeText(singup.this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    private boolean isEmailRegistered(String email) {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT id FROM Users WHERE email = ?", new String[]{email});
        boolean exists = cursor != null && cursor.getCount() > 0;
        if (cursor != null) cursor.close();
        return exists;
    }

    private long insertUser(String name, String email, String password) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put("name", name);
        values.put("email", email);
        values.put("password", password);
        return db.insert("Users", null, values);
    }
}
