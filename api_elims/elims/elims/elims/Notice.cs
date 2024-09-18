using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class Notice
{
    public int Id { get; set; }

    public string? Title { get; set; }

    public string? Message { get; set; }

    public string? Announcement { get; set; }

    public bool? IsShow { get; set; }
}
