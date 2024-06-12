using MongoDB.Driver;
using MongoDB.Bson;


public class Program
{
    public static void Movie()
    {

    }

    private static async Task<BsonDocument> MongoDb()
    {

        Console.WriteLine("====Running MongoDB====");
        var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
        if (connectionString == null)
        {
            Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string");
            Environment.Exit(0);
        }

        var client = new MongoClient(connectionString);
        var collection = client.GetDatabase("sample_mflix").GetCollection<BsonDocument>("movies");
        var filter = Builders<BsonDocument>.Filter.Eq("title", "Back to the Future");
        var document = await collection.Find(filter).FirstAsync();

        Console.WriteLine("=====End of MongoDB Method=====");
        return document;
    }
    private static void MapEndpoints(WebApplication app)
    {

        app.MapGet("/api/mongodb", async context =>
        {
            var response = await MongoDb();
            context.Response.ContentType = "application/json";
            Console.WriteLine($"Response: {response}");

            var newResponse = response.GetValue(1);
            await context.Response.WriteAsync(newResponse.ToString().ToJson());
            return;
        });
        return;
    }
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();
        app.Urls.Add("http://localhost:5090");
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        MapEndpoints(app);
        app.Run();
        return;
    }
}
