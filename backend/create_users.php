$admin = \App\Models\User::firstOrCreate(
    ['email' => 'realadmin@photobook.vn'],
    ['name' => 'Real Admin', 'password' => \Illuminate\Support\Facades\Hash::make('Admin@12345'), 'role' => 'admin']
);
$admin->tokens()->delete();
$tokenAdmin = $admin->createToken('admin-token')->plainTextToken;

$client = \App\Models\User::firstOrCreate(
    ['email' => 'realclient@photobook.vn'],
    ['name' => 'Real Client', 'password' => \Illuminate\Support\Facades\Hash::make('Client@12345'), 'role' => 'user']
);
$client->tokens()->delete();
$tokenClient = $client->createToken('client-token')->plainTextToken;

echo "\n--- KẾT QUẢ TẠO TÀI KHOẢN THẬT ---\n";
echo "ADMIN: realadmin@photobook.vn / Admin@12345\n";
echo "ADMIN_TOKEN: " . $tokenAdmin . "\n\n";

echo "CLIENT: realclient@photobook.vn / Client@12345\n";
echo "CLIENT_TOKEN: " . $tokenClient . "\n";
echo "---------------------------------\n";
