---
lastModified: '2016-07-27'
---

# Safe Reseeding With Laravel

## TL;DR

Use the Model's `firstOrCreate` method in your seeders:

```php
EmployeeType::firstOrCreate([
    'type' => 'manager',
]);
```

## The long story

We all know how awesome is Laravel and how awesome are its migrations and I want to share a special case that took me long to realize how to handle. **reseed**:

> seed more seeds but not repeat the seeded seeds.

I regularly use seeds to initialize some tables with static data.

### The case

Suppose I have a migration like this:

```php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmployeesType extends Migration
{
    public function up()
    {
        Schema::create('employees_type', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type', 32)->unique();
        });
    }

    public function down()
    {
        Schema::drop('employees_type');
    }
}
```

And a seeder like this:

```php
use Illuminate\Database\Seeder;
use App\EmployeeType;

class EmployeesTypeSeeder extends Seeder
{
    public function run()
    {
        EmployeeType::create([
            'type' => 'manager',
        ]);
}
```

And then I seed the database:

```bash
php artisan db:seed
```

### The problem

How do we add a new type of employee?

### The solution(s)

#### Solution 1:

We can create a new seeder and call just the new seeder with the `--class[=CLASS]` option:

```php
use Illuminate\Database\Seeder;
use App\EmployeeType;

class EmployeesTypeSeeder2 extends Seeder
{
    public function run()
    {
        EmployeeType::create([
            'type' => 'programmer',
        ]);
}
```

```bash
php artisan db:seed --class=EmployeesTypeSeeder2
```

I know it's not the perfect solution. Now we'll have seeds scattered in different classes and we need to always specify the class we need to seed. Let's try another solution.

#### Solution 2

You can add the new seeds in the same class but truncate the table at the very beginning:

```php
use Illuminate\Database\Seeder;
use App\EmployeeType;

class EmployeesTypeSeeder extends Seeder
{
    public function run()
    {
        EmployeeType::truncate();

        EmployeeType::create([
            'type' => 'manager',
        ]);
        EmployeeType::create([
            'type' => 'programmer',
        ]);
    }
}
```

```bash
php artisan db:seed
```

Now we may have problems with the references when we try to truncate the table. Other tables usually have foreign keys to this kind of tables.

#### Solution 3

Use `firstOrCreate` method.

Now you can add more seeds and reseed your database safely neither failing nor duplicating data:

```php
use Illuminate\Database\Seeder;
use App\EmployeeType;

class EmployeesTypeSeeder extends Seeder
{
    public function run()
    {
        EmployeeType::firstOrCreate([
            'type' => 'manager',
        ]);
        EmployeeType::firstOrCreate([
            'type' => 'programmer',
        ]);
    }
}
```

```bash
php artisan db:seed # execute it as many times as you want
```

Notice this solution works only for static data, so you can't do this:

```php
EmployeeType::firstOrCreate([
    'type' => 'programmer',
    'creation_date' => Carbon\Carbon::now(),
]);
```

because `Carbon\Carbon::now()` changes once a second.

### The benefits

A great benefit is that now you can `--seed` your database everytime you deploy. i.e.: you can add this line to your deploys:

```bash
php artisan migrate --seed --force
```
