using System;
using System.Collections.Generic;

namespace DataKastam.DataKastam;

public partial class CountryCode
{
    public string Code { get; set; } = null!;

    public string? Description { get; set; }

    public string? Latitude { get; set; }

    public string? Longitude { get; set; }

    public decimal? DecimalLatitude { get; set; }

    public decimal? DecimalLongtitude { get; set; }
}
