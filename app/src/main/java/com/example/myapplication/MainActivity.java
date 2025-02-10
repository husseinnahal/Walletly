package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.myapplication.SignUp.login;
import com.example.myapplication.SignUp.singup;
import com.example.myapplication.database.DatabaseConnection;

import java.sql.Connection;


public class MainActivity extends AppCompatActivity {

    DatabaseConnection db;
    Connection con;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        db = new DatabaseConnection();

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        Button buttontosign = findViewById(R.id.tosign);
        Button buttontologIn = findViewById(R.id.tologin);

        buttontosign.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, singup.class);
            startActivity(intent);
        });

        buttontologIn.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, login.class);
            startActivity(intent);
        });
    }
}
