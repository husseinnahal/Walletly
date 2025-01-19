package com.example.myapplication.ProfilePages;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.R;
import com.example.myapplication.database.DatabaseHelper;

public class EditProfile extends AppCompatActivity {

    private EditText nameEditText;
    private EditText emailEditText;
    private int userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.editprofile);

        nameEditText = findViewById(R.id.namefields);
        emailEditText = findViewById(R.id.emailfield);
        Button updateButton = findViewById(R.id.update);
        ImageView goBackButton = findViewById(R.id.returntext);

        userId = getIntent().getIntExtra("userId", -1);

        if (userId != -1) {
            fetchUserData(userId);
        } else {
            Toast.makeText(this, "User ID not found. Please try again.", Toast.LENGTH_SHORT).show();
        }

        goBackButton.setOnClickListener(v -> {
            Intent intent = new Intent(EditProfile.this, ProfileFragment.class);
            startActivity(intent);
        });

        updateButton.setOnClickListener(v -> updateUserData());
    }

    private void fetchUserData(int userId) {
        DatabaseHelper databaseHelper = new DatabaseHelper(this);
        SQLiteDatabase db = databaseHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT name, email FROM Users WHERE id = ?", new String[]{String.valueOf(userId)});

        if (cursor != null && cursor.moveToFirst()) {
            @SuppressLint("Range") String name = cursor.getString(cursor.getColumnIndex("name"));
            @SuppressLint("Range") String email = cursor.getString(cursor.getColumnIndex("email"));

            nameEditText.setText(name);
            emailEditText.setText(email);

            cursor.close();
        } else {
            Toast.makeText(this, "User details not found", Toast.LENGTH_SHORT).show();
        }

        db.close();
    }

    private void updateUserData() {
        String updatedName = nameEditText.getText().toString().trim();
        String updatedEmail = emailEditText.getText().toString().trim();

        if (updatedName.isEmpty() || updatedEmail.isEmpty()) {
            Toast.makeText(this, "Name and Email cannot be empty", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(updatedEmail).matches()) {
            Toast.makeText(this, "Invalid email format", Toast.LENGTH_SHORT).show();
            return;
        }

        DatabaseHelper databaseHelper = new DatabaseHelper(this);
        SQLiteDatabase db = databaseHelper.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put("name", updatedName);
        values.put("email", updatedEmail);

        try {
            int rowsAffected = db.update("Users", values, "id = ?", new String[]{String.valueOf(userId)});
            db.close();

            if (rowsAffected > 0) {
                Toast.makeText(this, "Profile updated successfully", Toast.LENGTH_SHORT).show();
                fetchUserData(userId); // Refresh UI with updated data
            } else {
                Toast.makeText(this, "Failed to update profile", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
            Log.e("UpdateDebug", "Error updating user: " + e.getMessage());
            Toast.makeText(this, "Email is already used", Toast.LENGTH_SHORT).show();
        }
    }
}
