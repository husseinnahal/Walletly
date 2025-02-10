package com.example.myapplication;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.database.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class amounts extends AppCompatActivity {

    private EditText dateInput, savedAmountInput;
    private Button createButton, backsaveButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_amounts);

        dateInput = findViewById(R.id.titletrainput);
        savedAmountInput = findViewById(R.id.savedamunt);
        createButton = findViewById(R.id.createam);
        backsaveButton = findViewById(R.id.backsave);

        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String date = dateInput.getText().toString().trim();
                String amountText = savedAmountInput.getText().toString().trim();

                if (date.isEmpty() || amountText.isEmpty()) {
                    Toast.makeText(amounts.this, "Please enter all fields", Toast.LENGTH_SHORT).show();
                    return;
                }

                double amount = Double.parseDouble(amountText);

                SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
                int userId = sharedPreferences.getInt("userId", -1);

                if (userId == -1) {
                    Toast.makeText(amounts.this, "User is not logged in", Toast.LENGTH_SHORT).show();
                    return;
                }


                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {

                            Connection connection = DatabaseConnection.getConnection();
                            if (connection != null) {
                                String query = "INSERT INTO saving (user_id, date, amount) VALUES (?, ?, ?)";
                                PreparedStatement statement = connection.prepareStatement(query);
                                statement.setInt(1, userId);
                                statement.setString(2, date);
                                statement.setDouble(3, amount);

                                int result = statement.executeUpdate();
                                if (result > 0) {
                                    runOnUiThread(() -> {
                                        Toast.makeText(amounts.this, "Saving added successfully", Toast.LENGTH_SHORT).show();
                                        dateInput.setText("");
                                        savedAmountInput.setText("");
                                    });
                                } else {
                                    runOnUiThread(() -> {
                                        Toast.makeText(amounts.this, "Failed to add saving", Toast.LENGTH_SHORT).show();
                                    });
                                }
                                connection.close();
                            }
                        } catch (SQLException e) {
                            e.printStackTrace();
                            runOnUiThread(() -> {
                                Toast.makeText(amounts.this, "Error connecting to database", Toast.LENGTH_SHORT).show();
                            });
                        }
                    }
                }).start();
            }
        });

        backsaveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }
}
