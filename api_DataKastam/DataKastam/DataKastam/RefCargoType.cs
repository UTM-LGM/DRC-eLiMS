using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam;

public partial class RefCargoType
{
    public string Kod { get; set; } = null!;

    public string? Deskripsi { get; set; }

    public virtual ICollection<K3Header> K3Headers { get; set; } = new List<K3Header>();
}
