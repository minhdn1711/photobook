<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin account
        User::firstOrCreate(
            ['email' => 'admin@photobook.vn'],
            [
                'name'     => 'Admin Photobook',
                'password' => Hash::make('Admin@12345'),
                'role'     => 'admin',
            ]
        );

        // Demo customer account
        User::firstOrCreate(
            ['email' => 'demo@photobook.vn'],
            [
                'name'     => 'Nguyễn Demo',
                'password' => Hash::make('Demo@12345'),
                'role'     => 'user',
            ]
        );

        $this->command->info('  ✓ Users seeded (admin + demo)');
    }
}
