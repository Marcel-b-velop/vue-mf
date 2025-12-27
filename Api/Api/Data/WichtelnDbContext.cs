using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class WichtelnDbContext : DbContext
{
    public WichtelnDbContext(DbContextOptions<WichtelnDbContext> options)
        : base(options)
    {
    }

    public DbSet<Gruppe> Gruppen { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Gruppe>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.GrpBase64).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.CreatedByUserId).IsRequired();
        });
    }
}

public class Gruppe
{
    public int Id { get; set; }
    public string GrpBase64 { get; set; } = string.Empty;
    public string CreatedByUserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

