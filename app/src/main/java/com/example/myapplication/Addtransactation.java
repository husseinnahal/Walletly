package com.example.myapplication;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.database.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Addtransactation extends AppCompatActivity {

    private EditText amountTran, titleTran, catTranInput;
    private RadioGroup rgType;
    private Button createTran, backButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_addtransactation);

        amountTran = findViewById(R.id.savedamunt);
        titleTran = findViewById(R.id.titletrainput);
        catTranInput = findViewById(R.id.cattraninput);
        rgType = findViewById(R.id.rg_type);
        createTran = findViewById(R.id.createam);
        backButton = findViewById(R.id.backsave);

        createTran.setOnClickListener(v -> new Thread(this::saveTransaction).start());

        backButton.setOnClickListener(v -> {
            Intent intent = new Intent(Addtransactation.this, HomeFragment.class);
            startActivity(intent);
        });
    }

    private void saveTransaction() {
        String title = titleTran.getText().toString().trim();
        String amountStr = amountTran.getText().toString().trim();
        String category = catTranInput.getText().toString().trim();

        if (title.isEmpty() || amountStr.isEmpty() || category.isEmpty()) {
            runOnUiThread(() -> Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show());
            return;
        }

        double amount;
        try {
            amount = Double.parseDouble(amountStr);
        } catch (NumberFormatException e) {
            runOnUiThread(() -> Toast.makeText(this, "Invalid amount", Toast.LENGTH_SHORT).show());
            return;
        }

        int selectedId = rgType.getCheckedRadioButtonId();
        if (selectedId == -1) {
            runOnUiThread(() -> Toast.makeText(this, "Please select a transaction type", Toast.LENGTH_SHORT).show());
            return;
        }
        RadioButton selectedRadio = findViewById(selectedId);
        String transactionType = selectedRadio.getText().toString().toLowerCase();

        SharedPreferences sharedPreferences = getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
        int userId = sharedPreferences.getInt("userId", -1);
        if (userId == -1) {
            runOnUiThread(() -> Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show());
            return;
        }

        Connection connection = DatabaseConnection.getConnection();
        if (connection != null) {
            try {
                String sql = "INSERT INTO payments (title, amount, type, category, user_id) VALUES (?, ?, ?, ?, ?)";
                PreparedStatement statement = connection.prepareStatement(sql);
                statement.setString(1, title);
                statement.setDouble(2, amount);
                statement.setString(3, transactionType);
                statement.setString(4, category);
                statement.setInt(5, userId);

                int rowsInserted = statement.executeUpdate();
                if (rowsInserted > 0) {
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Transaction added successfully", Toast.LENGTH_SHORT).show();
                        clearFields();
                    });
                } else {
                    runOnUiThread(() -> Toast.makeText(this, "Failed to add transaction", Toast.LENGTH_SHORT).show());
                }

                statement.close();
                connection.close();
            } catch (SQLException e) {
                runOnUiThread(() -> Toast.makeText(this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show());
            }
        } else {
            runOnUiThread(() -> Toast.makeText(this, "Database connection failed", Toast.LENGTH_SHORT).show());
        }
    }

    private void clearFields() {
        amountTran.setText("");
        titleTran.setText("");
        catTranInput.setText("");
        rgType.clearCheck();
    }
}
